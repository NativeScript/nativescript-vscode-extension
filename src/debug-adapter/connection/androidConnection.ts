import * as http from 'http';
import {EventEmitter} from 'events';
import {Services} from '../../services/debugAdapterServices';
import * as Net from 'net';
import {WebKitConnection} from './webKitConnection';
import {Tags} from '../../common/logger';

interface IMessageWithId {
    id: number;
    method: string;
    params?: string[];
}

class Callbacks {
    private lastId: number = 1;
    private callbacks: any = {};

    public wrap(callback: any): number {
        var callbackId = this.lastId++;
        this.callbacks[callbackId] = callback || function() { };
        return callbackId;
    }

    public processResponse(callbackId: any, args: any) {

        var callback = this.callbacks[callbackId];

        if (callback) {
            callback.apply(null, args);
        }

        delete this.callbacks[callbackId];
    }

    public removeResponseCallbackEntry(callbackId: any) {
        delete this.callbacks[callbackId];
    }

}

class ResReqNetSocket extends EventEmitter {
    private _pendingRequests = new Map<number, any>();

    private connected = false;
    private debugBuffer: any = '';
    private msg: any = false;
    private conn: Net.Socket;
    private offset: number;
    private contentLengthMatch: any;
    private lastError: string;
    private callbacks: Callbacks;
    private isRunning: boolean;
    private isMessageFlushLoopStarted = false;
    private hasNewDataMessage = false;

    public attach(port: number, url: string, timeout: number = 10000) {
        Services.logger().log(`Attempting to attach on ${url} on port ${port}`, Tags.FrontendMessage);
        var that = this;
        this.callbacks = new Callbacks();

        return new Promise<void>((resolve, reject) => {

            that.conn = Net.createConnection(port, url),
            that.conn.setEncoding('utf8');

            setTimeout(() => {
                reject('Connection timed out')
            }, timeout);

            that.conn.on('error', reject);

            that.conn.on('connect', function() {
                // Replace the promise-rejecting handler
                that.conn.removeListener('error', reject);

                that.conn.on('error', e => {
                    console.error('socket error: ' + e.toString());

                    if ((<any>e).code == 'ECONNREFUSED') {
                        (<any>e).helpString = 'Is node running with --debug port ' + port + '?';
                    } else if ((<any>e).code == 'ECONNRESET') {
                        (<any>e).helpString = 'Check there is no other debugger client attached to port ' + port + '.';
                    }

                    that.lastError = e.toString();
                    if ((<any>e).helpString) {
                        that.lastError += '. ' + (<any>e).helpString;
                    }

                    that.emit('error', e);
                });

                that.conn.on('data', function(data) {
                    that.debugBuffer += data;
                    that.parse(function() {
                         that.connected = true;
                         that.emit('connect');
                         resolve();
                    });
                });


                that.conn.on('end', function() {
                    that.close();
                });

                that.conn.on('close', function() {
                    if (!that.connected)
                    {
                        reject("Can't connect. Check the application is running on the device");
                        that.emit('close', that.lastError || 'Debugged process exited.');
                        return;
                    }
                    that.connected = false;
                    that.emit('close', that.lastError || 'Debugged process exited.');
                });
            });
        });
    }

    private makeMessage() {
        return {
            headersDone: false,
            headers: null,
            contentLength: 0
        };
    }

    private parse(connectedCallback: () => any) {
        var b, obj;
        var that = this;
        if (this.msg && this.msg.headersDone) {
            //parse body
            if (Buffer.byteLength(this.debugBuffer) >= this.msg.contentLength) {
                b = new Buffer(this.debugBuffer);
                this.msg.body = b.toString('utf8', 0, this.msg.contentLength);
                this.debugBuffer = b.toString('utf8', this.msg.contentLength, b.length);
                if (this.msg.body.length > 0) {
                    obj = JSON.parse(this.msg.body);
                    Services.logger().log('From target(' + (obj.type ? obj.type : '') + '): ' + this.msg.body);
                    if (typeof obj.running === 'boolean') {
                        this.isRunning = obj.running;
                    }
                    if (obj.type === 'response' && obj.request_seq > 0) {
                        this.callbacks.processResponse(obj.request_seq, [obj]);
                    }
                    else if (obj.type === 'event') {
                        if (obj.event === "afterCompile") {
                            if (!that.connected && connectedCallback) {
                                connectedCallback();
                            }
                        }

                        this.emit(obj.event, obj);
                    }
                }
                this.msg = false;
                this.parse(connectedCallback);
            }
            return;
        }

        if (!this.msg) {
            this.msg = this.makeMessage();
        }

        this.offset = this.debugBuffer.indexOf('\r\n\r\n');
        if (this.offset > 0) {
            this.msg.headersDone = true;
            this.msg.headers = this.debugBuffer.substr(0, this.offset + 4);
            this.contentLengthMatch = /Content-Length: (\d+)/.exec(this.msg.headers);
            if (this.contentLengthMatch[1]) {
                this.msg.contentLength = parseInt(this.contentLengthMatch[1], 10);
            }
            else {
                console.warn('no Content-Length');
            }
            this.debugBuffer = this.debugBuffer.slice(this.offset + 4);
            this.parse(connectedCallback);
        }
    }

    public send(data) {
        if (this.connected) {
            Services.logger().log('To target: ' + data);
            this.conn.write('Content-Length: ' + data.length + '\r\n\r\n' + data);
            this.hasNewDataMessage = true;
             if (!this.isMessageFlushLoopStarted) {
                this.isMessageFlushLoopStarted = true;
                setInterval(() => {
                    if (this.hasNewDataMessage) {
                        let msg = 'FLUSH BUFFERS';
                        this.conn.write('Content-Length: ' + msg.length + '\r\n\r\n' + msg);
                        this.hasNewDataMessage = false;
                    }
                }, 200);
            }
        }
    }

    public request(command, params, callback) {
        var msg = {
            seq: 0,
            type: 'request',
            command: command
        };

        if (typeof callback == 'function') {
            msg.seq = this.callbacks.wrap(callback);
        }

        if (params) {
            Object.keys(params).forEach(function(key) {
                msg[key] = params[key];
            });
        }
        this.send(JSON.stringify(msg));
    }

    public close() {
        if (this.conn) {
            this.conn.end();
        }
    }
}


export class AndroidConnection extends WebKitConnection {
    private _nextId = 1;
    private _socket: ResReqNetSocket;

    constructor() {
        super();
        let that = this;
        this._socket = new ResReqNetSocket();

        this._socket.on("afterCompile", function(params) {

            let scriptData = <Webkit.Debugger.ScriptParsedEventArgs>{
                scriptId: String(params.body.script.id),
                url: params.body.script.name,
                startLine: params.body.script.lineOffset,
                startColumn: params.body.script.columnOffset
            };

            that._socket.emit("Debugger.scriptParsed", scriptData);
        });


        this._socket.on("break", function(params) {
            that.handleBreakEvent(params);
        });

         this._socket.on("exception", function(params) {
            that.handleBreakEvent(params);
        });

         this._socket.on("messageAdded", function(params) {
            that._socket.emit("Console.messageAdded", params.body);
        });
    }

    private handleBreakEvent(params: any): Promise<any> {
        let that = this;
        return this.fetchCallFrames().then(callFrames => {
            let scriptData = <Webkit.Debugger.PausedEventArgs>{
                reason: "other",
                hitBreakpoints: params ? (params.breakpoints || []) : [],
                callFrames: callFrames
            };

            that._socket.emit("Debugger.paused", scriptData);
        });
    }

    private v8ScopeTypeToString(v8ScopeType: number): string {
        switch (v8ScopeType) {
            case 0:
                return 'global';
            case 1:
                return 'local';
            case 2:
                return 'with';
            case 3:
                return 'closure';
            case 4:
                return 'catch';
            default:
                return 'unknown';
        }
    }

    private v8ResultToInspectorResult(result: any): any {
        if (['object', 'function', 'regexp', 'error'].indexOf(result.type) > -1) {
            return this.v8RefToInspectorObject(result);
        }

        if (result.type == 'null') {
            // workaround for the problem with front-end's setVariableValue
            // implementation not preserving null type
            result.value = null;
        }

        return {
            type: result.type,
            value: result.value,
            description: String(result.value)
        };
    }

    private inspectorUrlToV8Name(url: string): string {
        let path = url.replace(/^file:\/\//, '');
        if (/^\/[a-zA-Z]:\//.test(path))
            return path.substring(1).replace(/\//g, '\\'); // Windows disk path
        if (/^\//.test(path))
            return path; // UNIX-style
        if (/^file:\/\//.test(url))
            return '\\\\' + path.replace(/\//g, '\\'); // Windows UNC path

        return url;
    };

    private v8LocationToInspectorLocation(v8loc: any): any {
        return {
            scriptId: v8loc.script_id.toString(),
            lineNumber: v8loc.line,
            columnNumber: v8loc.column
        };
    };

    private v8RefToInspectorObject(ref: any): any {
        var desc = '',
            type = ref.type,
            size,
            name,
            objectId;

        switch (type) {
            case 'object':
                name = /#<(\w+)>/.exec(ref.text);
                if (name && name.length > 1) {
                    desc = name[1];
                    if (desc === 'Array' || desc === 'Buffer') {
                        size = ref.properties.filter(function(p) { return /^\d+$/.test(p.name); }).length;
                        desc += '[' + size + ']';
                    }
                } else if (ref.className === 'Date') {
                    desc = new Date(ref.value).toString();
                    type = 'date';
                } else {
                    desc = ref.className || 'Object';
                }
                break;
            case 'function':
                desc = ref.text || 'function()';
                break;
            case 'error':
                type = 'object';
                desc = ref.text || 'Error';
                break;
            default:
                desc = ref.text || '';
                break;
        }
        if (desc.length > 100) {
            desc = desc.substring(0, 100) + '\u2026';
        }

        objectId = ref.handle;
        if (objectId === undefined)
            objectId = ref.ref;

        return {
            type: type,
            objectId: String(objectId),
            className: ref.className,
            description: desc
        };
    }

    private v8ErrorToInspectorError(message: any) {
        var nameMatch = /^([^:]+):/.exec(message);
        return {
            type: 'object',
            objectId: 'ERROR',
            className: nameMatch ? nameMatch[1] : 'Error',
            description: message
        };
    };

    private fetchCallFrames(): Promise<Webkit.Debugger.CallFrame[]> {

        let that = this;
        return this.request("backtrace",
            {
                inlineRefs: true,
                fromFrame: 0,
                toFrame: 50
            })
            .then(response => {
                var debuggerFrames = <Array<any>>response.frames || [];
                let frames = debuggerFrames.map(function(frame) {
                    var scopeChain = frame.scopes.map(function(scope) {
                        return {
                            object: {
                                type: 'object',
                                objectId: 'scope:' + frame.index + ':' + scope.index,
                                className: 'Object',
                                description: 'Object'
                            },
                            type: that.v8ScopeTypeToString(scope.type)
                        };
                    });

                    return {
                        callFrameId: frame.index.toString(),
                        functionName: frame.func.inferredName || frame.func.name,
                        location: {
                            scriptId: String(frame.func.scriptId),
                            lineNumber: frame.line,
                            columnNumber: frame.column
                        },
                        scopeChain: scopeChain,
                        this: that.v8RefToInspectorObject(frame.receiver)
                    }
                });

                return frames;
            });
    }

    /**
     * Attach listeners for webkit events emitted by the underlying socket
     */
    public on(event: string | symbol, listener: Function): this {
        this._socket.on(event, listener);
        return this;
    }

    public attach(port: number, url?: string): Promise<void> {
        Services.logger().log('Attempting to attach on port ' + port);
        return this._socket.attach(port, url);
    }

    public close(): void {
        this._socket.close();
    }

    enable(): Promise<Webkit.Response<any>> {
        return Promise.resolve();
    }

    disable(): Promise<Webkit.Response<any>> {
        return Promise.resolve();
    }

    setBreakpointsActive?(args: Webkit.Debugger.SetBreakpointsActiveParams): Promise<Webkit.Response<any>> {
        return Promise.resolve();
    }

    public setBreakpointByUrl(args: Webkit.Debugger.SetBreakpointByUrlParams ): Promise<Webkit.Response<Webkit.Debugger.SetBreakpointByUrlResult>> {
        let that = this;
        var requestParams = {
            type: 'script',
            target: that.inspectorUrlToV8Name(args.url),
            line: args.lineNumber,
            column: args.columnNumber,
            condition: args.options.condition,
            ignoreCount: args.options.ignoreCount
        };

        return this.request("setbreakpoint", requestParams)
            .then(response => {
                return {
                        result: {
                            breakpointId: response.breakpoint.toString(),
                            locations: response.actual_locations.map(that.v8LocationToInspectorLocation),
                        },
                    }
            });
    }

    public removeBreakpoint(args: Webkit.Debugger.RemoveBreakpointParams ): Promise<Webkit.Response<any>> {
        return this.request("clearbreakpoint", {
            breakpoint: args.breakpointId
        });
    }

    public stepOver(): Promise<Webkit.Response<any>> {
        return this.sendContinue('next');
    }

    public stepInto(): Promise<Webkit.Response<any>> {
        return this.sendContinue('in');
    }

    public stepOut(): Promise<Webkit.Response<any>> {
        return this.sendContinue('out');
    }

    public resume(): Promise<Webkit.Response<any>> {
        return this.sendContinue(null);
    }

    private sendContinue(stepAction: string): Promise<any> {
        let that = this;
        let args = stepAction ? { stepaction: stepAction } : undefined;
        return this.request("continue", args).then(response => {
            that._socket.emit("'Debugger.resumed");
            return response;
        })
    }

    public pause(): Promise<Webkit.Response<any>> {
        let that = this;
        return this.request("suspend", {})
            .then(reponse => that.handleBreakEvent(null));
    }

    public evaluateOnCallFrame(args: Webkit.Debugger.EvaluateOnCallFrameParams): Promise<Webkit.Response<Webkit.Debugger.EvaluateOnCallFrameResult>> {
        var requestParams = {
            expression: args.expression,
            frame: args.callFrameId
        };

        let that = this;
        return this.request("evaluate", requestParams).then(response => {
            return {
              result: {
                    result : that.v8ResultToInspectorResult(response),
                    wasThrown : false
                }
            }
        });
    }

    public setPauseOnExceptions(args: Webkit.Debugger.SetPauseOnExceptionsParams): Promise<Webkit.Response<any>> {
        var requestParams = {
            type: args.state !== 'none' ? args.state : "uncaught",
            enabled: args.state !== 'none'
        };

        let messageId = this._nextId++;
        return this.request("setexceptionbreak", requestParams).then(response => {
            return new Promise((resolve, reject) => {
                if (response.error) {
                    reject(response.error);
                    return;
                }
                resolve({ id: messageId });
            });
        });
    }

    public getScriptSource(args: Webkit.Debugger.GetScriptSourceParams): Promise<Webkit.Response<Webkit.Debugger.GetScriptSourceResult>> {
        var requestParams = {
            includeSource: true,
            types: 4,
            ids: [Number(args.scriptId)]
        };

        let messageId = this._nextId++;
        return this.request("scripts", requestParams).then(response => {
            return new Promise((resolve, reject) => {
                if (response.error) {
                    reject(response.error);
                    return;
                }

                let source = undefined;
                if (Array.isArray(response))
                {
                    source = response[0].source;
                }
                else if (response.result)
                {
                    source = response.result[0].source;
                }
                else if (response.source) {
                    source = response.source;
                }

                resolve({
                    id: messageId,
                    result: {
                        scriptSource: source
                    }
                });
            });
        });
    }

    private request(command, args): Promise<any> {

        return new Promise((resolve, reject) => {
            this._socket.request(command, { arguments: args }, response => {
                if (!response.success) {
                    reject(new Error(response.message));
                    return;
                }


                if (response.refs) {

                    let refsLookup = {};
                    response.refs.forEach(function(r) { refsLookup[r.handle] = r; });

                    //TODO: response.body may be undefined in that case set it to {} here
                    response.body.refsLookup = refsLookup;
                }

                resolve(response.body);
            });
        });
    }


    ////getProperties Functions. Implementation in RuntimeAgent.js
    public getProperties(args: Webkit.Runtime.GetPropertiesParams): Promise<Webkit.Response<Webkit.Runtime.GetPropertiesResult>> {
        return this.isScopeId(args.objectId).then(response => {
            if (response) {
                return this.getPropertiesOfScopeId(args.objectId);
            }
            else {
                // accessorPropertiesOnly is not part of the WebKit debug protocol, but for Android debugging, it will be respected in case it is set to true.
                if (!args.ownProperties || (<any>args).accessorPropertiesOnly) {
                    // Temporary fix for missing getInternalProperties() implementation
                    // See the comment in RuntimeAgent.js->getProperties and GH issue #213 (node-inspector repo)
                    return { result: [] };
                }

                return this.getPropertiesOfObjectId(args.objectId);
            }
        }).then(response => {
            let properties = response.result;
            let result = [];
            for (var i = 0; properties && i < properties.length; ++i) {
                let property = properties[i];
                //convert the result to <WebKitProtocol.Runtime.PropertyDescriptor>
                result.push({
                    name: property.name,
                    writeable: property.writable,
                    enumerable: property.enumerable,
                    value: property.value
                });
            }

            return {
                result: {
                    result: result
                }
            };
        });
    }

    private isScopeId(objectId: string): Promise<boolean> {
        let SCOPE_ID_MATCHER = /^scope:(\d+):(\d+)$/;
        return Promise.resolve(SCOPE_ID_MATCHER.test(objectId))
    }

    private getPropertiesOfScopeId(scopeId: string): Promise<any> {

        let SCOPE_ID_MATCHER = /^scope:(\d+):(\d+)$/;
        let scopeIdMatch = SCOPE_ID_MATCHER.exec(scopeId);

        if (!scopeIdMatch) {
            return Promise.reject(new Error('Invalid scope id "' + scopeId + '"'));
        }
        let that = this;
        return this.request("scope",
            {
                number: Number(scopeIdMatch[2]),
                frameNumber: Number(scopeIdMatch[1])
            })
            .then(response => {
                return response.object.ref;
            }).then(response => {
                return that.getPropertiesOfObjectId(response);
            });
    };

    private getPropertiesOfObjectId(objectId: string): Promise<any> {
        let handle = parseInt(objectId, 10);
        let request = { handles: [handle], includeSource: false };
        let that = this;
        return this.request("lookup", request)
            .then(response => {
                let obj;
                let proto;
                let props;

                obj = response[handle];
                proto = obj.proto;
                props = obj.properties;

                if (props) {
                    props = props.map(function(p) {
                        var ref = response.refsLookup[p.ref];
                        return {
                            name: String(p.name),
                            writable: (p.attributes & 1) != 1,
                            enumerable: (p.attributes & 2) != 2,
                            value: that.v8ResultToInspectorResult(ref)
                        };
                    });
                }

                if (proto)
                    props.push({
                        name: '__proto__',
                        value: that.v8RefToInspectorObject(response.refsLookup[proto.ref])
                    });

                return { result: props };
            });
    }
}
