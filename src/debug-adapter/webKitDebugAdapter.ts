/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import {Handles, StoppedEvent, InitializedEvent, TerminatedEvent, OutputEvent} from 'vscode-debugadapter';
import {DebugProtocol} from 'vscode-debugprotocol';
import {WebKitConnection} from './connection/webKitConnection';
import {IosConnection} from './connection/iosConnection';
import {AndroidConnection} from './connection/androidConnection';
import {Project, DebugResult} from '../project/project';
import {IosProject} from '../project/iosProject';
import {AndroidProject} from '../project/androidProject';
import * as utils from '../common/utilities';
import {formatConsoleMessage} from './consoleHelper';
import {Services} from '../services/debugAdapterServices';
import {LoggerHandler, Handlers, Tags} from '../common/Logger';
import {DebugRequest} from './debugRequest';

interface IScopeVarHandle {
    objectId: string;
    thisObj?: Webkit.Runtime.RemoteObject;
}

export class WebKitDebugAdapter implements DebugProtocol.IDebugAdapter {
    private static THREAD_ID = 1;
    private static EXCEPTION_VALUE_ID = 'EXCEPTION_VALUE_ID';

    private _initArgs: DebugProtocol.InitializeRequestArguments;

    private _variableHandles: Handles<IScopeVarHandle>;
    private _currentStack: Webkit.Debugger.CallFrame[];
    private _committedBreakpointsByUrl: Map<string, Webkit.Debugger.BreakpointId[]>;
    private _exceptionValueObject: Webkit.Runtime.RemoteObject;
    private _expectingResumedEvent: boolean;
    private _scriptsById: Map<Webkit.Debugger.ScriptId, Webkit.Debugger.ScriptParsedEventArgs>;
    private _setBreakpointsRequestQ: Promise<any>;
    private _webKitConnection: WebKitConnection;
    private _eventHandler: (event: DebugProtocol.Event) => void;
    private _lastOutputEvent: OutputEvent;
    private _loggerFrontendHandler: LoggerHandler = args => this.fireEvent(new OutputEvent(`  ›${args.message}\n`, args.type.toString()));
    private _request: DebugRequest;

    public constructor() {
        this._variableHandles = new Handles<IScopeVarHandle>();

        // Messages tagged with a special tag are sent to the frontend through the debugging protocol
        Services.logger().addHandler(this._loggerFrontendHandler, [Tags.FrontendMessage]);
        Services.logger().log(`OS: ${os.platform()} ${os.arch()}`);
        Services.logger().log('Node version: ' + process.version);
        Services.logger().log('Adapter version: ' + utils.getInstalledExtensionVersion().toString());

        this.clearEverything();
    }

    private get paused(): boolean {
        return !!this._currentStack;
    }

    private clearTargetContext(): void {
        this._scriptsById = new Map<Webkit.Debugger.ScriptId, Webkit.Debugger.ScriptParsedEventArgs>();
        this._committedBreakpointsByUrl = new Map<string, Webkit.Debugger.BreakpointId[]>();
        this._setBreakpointsRequestQ = Promise.resolve<void>();
        this._lastOutputEvent = null;
        this.fireEvent({ seq: 0, type: 'event',  event: 'clearTargetContext'});
    }

    private clearClientContext(): void {
        this.fireEvent({ seq: 0, type: 'event',  event: 'clearClientContext'});
    }

    public registerEventHandler(eventHandler: (event: DebugProtocol.Event) => void): void {
        this._eventHandler = eventHandler;
    }

    public initialize(args: DebugProtocol.InitializeRequestArguments): DebugProtocol.Capabilities | Promise<DebugProtocol.Capabilities> {
        // Cache to log if diagnostic logging is enabled later
        this._initArgs = args;
        return {
            supportsConfigurationDoneRequest: true,
            supportsFunctionBreakpoints: false,
            supportsConditionalBreakpoints: true,
            supportsEvaluateForHovers: false,
            supportsHitConditionalBreakpoints: true, // TODO: Not working on Android
            exceptionBreakpointFilters: [{
				label: 'All Exceptions',
				filter: 'all',
				default: false
			},
			{
				label: 'Uncaught Exceptions',
				filter: 'uncaught',
				default: true
			}],
            supportsStepBack: false,
            supportsSetVariable: false, // TODO: Check if can be enabled
            supportsRestartFrame: false, // TODO: Check if can be enabled
            supportsGotoTargetsRequest: false, // TODO: Check if can be enabled
            supportsStepInTargetsRequest: false, // TODO: Check if can be enabled
            supportsCompletionsRequest: false, // TODO: Check if can be enabled
            supportsModulesRequest: false, // TODO: Check if can be enabled
            additionalModuleColumns: undefined, // TODO: Check if can be enabled
            supportedChecksumAlgorithms: undefined // TODO: Check if can be enabled
        }
    }

    public configurationDone(args: DebugProtocol.ConfigurationDoneArguments): void {

    }

    public launch(args: DebugProtocol.ILaunchRequestArgs): Promise<void> {
        return this.processRequest(args);
    }

    public attach(args: DebugProtocol.IAttachRequestArgs): Promise<void> {
        return this.processRequest(args);
    }

    private configureLoggingForRequest(args: DebugProtocol.IRequestArgs): void {
        if (args.diagnosticLogging) {
            // The logger frontend handler is initially configured to handle messages with LoggerTagFrontendMessage tag only.
            // We remove the handler and add it again for all messages.
            Services.logger().removeHandler(this._loggerFrontendHandler);
            Services.logger().addHandler(this._loggerFrontendHandler);
        }
        if (args.tnsOutput) {
            Services.logger().addHandler(Handlers.createStreamHandler(fs.createWriteStream(args.tnsOutput)));
        }
        Services.logger().log(`initialize(${JSON.stringify(this._initArgs) })`);
        Services.logger().log(`${args.request}(${JSON.stringify(args)})`);
    }

    private processRequest(args: DebugProtocol.IRequestArgs): Promise<void> {
        // Initialize the request
        this.configureLoggingForRequest(args);
        Services.appRoot = args.appRoot;
        return Services.extensionClient().getInitSettings().then(settings => {
            Services.cliPath = settings.tnsPath || Services.cliPath;
            this._request = new DebugRequest(args, Services.cli());
            Services.extensionClient().analyticsLaunchDebugger({ request: this._request.isSync ? "sync" : args.request, platform: args.platform });

            // FIXME: Workaround for https://github.com/NativeScript/nativescript-cli/issues/2292
            let cliBuildCommand = Promise.resolve();
            if (this._request.isSync && !fs.existsSync(this._request.project.platformBuildPath())) {
                cliBuildCommand = new Promise((resolve, reject) => {
                    let cliBuildProcess = this._request.project.build([]);
                    cliBuildProcess.stdout.on('data', data => { Services.logger().log(data.toString(), Tags.FrontendMessage); });
                    cliBuildProcess.stderr.on('data', data => { Services.logger().error(data.toString(), Tags.FrontendMessage); });
                    cliBuildProcess.on('close', (code) => {
                        code ? reject(`The build command exited with code: ${code}`) : resolve();
                    });
                });
            }

            return cliBuildCommand.then(() => {
                // Run CLI Command
                let cliCommand: DebugResult;
                if (this._request.isLaunch) {
                    cliCommand = this._request.project.debug({ stopOnEntry: this._request.launchArgs.stopOnEntry }, this._request.args.tnsArgs);
                }
                else if (this._request.isSync) {
                    cliCommand = this._request.project.debugWithSync({ stopOnEntry: this._request.launchArgs.stopOnEntry, syncAllFiles: this._request.launchArgs.syncAllFiles }, this._request.args.tnsArgs);
                }
                else if (this._request.isAttach) {
                    cliCommand = this._request.project.attach(this._request.args.tnsArgs);
                }

                if (cliCommand.tnsProcess) {
                    cliCommand.tnsProcess.stdout.on('data', data => { Services.logger().log(data.toString(), Tags.FrontendMessage); });
                    cliCommand.tnsProcess.stderr.on('data', data => { Services.logger().error(data.toString(), Tags.FrontendMessage); });
                    cliCommand.tnsProcess.on('close', (code, signal) => { Services.logger().error(`The tns command finished its execution with code ${code}.`, Tags.FrontendMessage); });
                }

                let promiseResolve = null;
                let promise: Promise<void> = new Promise<void>((res, rej) => { promiseResolve = res; });
                // Attach to the running application
                cliCommand.tnsOutputEventEmitter.on('readyForConnection', (connectionToken: string | number) => {
                    connectionToken = this._request.isAndroid ? this._request.androidProject.getDebugPortSync() : connectionToken;
                    Services.logger().log(`Attaching to application on ${connectionToken}`);
                    let connection: WebKitConnection = this._request.isAndroid ? new AndroidConnection() : new IosConnection();
                    this.setConnection(connection);
                    let attachPromise = this._request.isAndroid ? (<AndroidConnection>connection).attach(<number>connectionToken, 'localhost') : (<IosConnection>connection).attach(<string>connectionToken);
                    attachPromise.then(() => {
                        return Promise.all<Webkit.Response<any>>([
                            this._webKitConnection.enable(),
                            this._webKitConnection.setBreakpointsActive({ active: true })
                        ]);
                    }).then(() => {
                        // Send InitializedEvent
                        this.fireEvent(new InitializedEvent());
                        promiseResolve();
                    });
                });

                return promise;
            });
        });

    }

    private setConnection(connection: WebKitConnection) : WebKitConnection {
        let args = this._request.args;
        connection.on('Debugger.paused', params => this.onDebuggerPaused(params));
        connection.on('Debugger.resumed', () => this.onDebuggerResumed());
        connection.on('Debugger.scriptParsed', params => this.onScriptParsed(params));
        connection.on('Debugger.globalObjectCleared', () => this.onGlobalObjectCleared());
        connection.on('Debugger.breakpointResolved', params => this.onBreakpointResolved(params));
        connection.on('Console.messageAdded', params => this.onConsoleMessage(params));
        connection.on('Console.messageRepeatCountUpdated', params => this.onMessageRepeatCountUpdated(params));
        connection.on('Inspector.detached', () => this.terminateSession());
        connection.on('close', () => this.terminateSession());
        connection.on('error', () => this.terminateSession());
        connection.on('connect', () => this.onConnected())
        this._webKitConnection = connection;
        return connection;
    }

    private onConnected(): void {
        Services.logger().log("Debugger connected");
    }

    private fireEvent(event: DebugProtocol.Event): void {
        if (this._eventHandler) {
            this._eventHandler(event);
        }
    }

    private terminateSession(): void {
        this.clearEverything();
        // In case of a sync request the session is not terminated when the backend is detached
        if (!this._request.isSync) {
            Services.logger().log("Terminating debug session");
            this.fireEvent(new TerminatedEvent());
        }
    }

    private clearEverything(): void {
        this.clearClientContext();
        this.clearTargetContext();

        if (this._webKitConnection) {
            Services.logger().log("Closing debug connection");

            this._webKitConnection.close();
            this._webKitConnection = null;
        }
    }

    /**
     * e.g. the target navigated
     */
    private onGlobalObjectCleared(): void {
        this.clearTargetContext();
    }

    private onDebuggerPaused(notification: Webkit.Debugger.PausedEventArgs): void {
        this._currentStack = notification.callFrames;

        // We can tell when we've broken on an exception. Otherwise if hitBreakpoints is set, assume we hit a
        // breakpoint. If not set, assume it was a step. We can't tell the difference between step and 'break on anything'.
        let reason: string;
        let exceptionText: string;
        if (notification.reason === 'exception') {
            reason = 'exception';
            if (notification.data && this._currentStack.length) {
                // Insert a scope to wrap the exception object. exceptionText is unused by Code at the moment.
                const remoteObjValue = utils.remoteObjectToValue(notification.data, false);
                let scopeObject: Webkit.Runtime.RemoteObject;

                if (remoteObjValue.variableHandleRef) {
                    // If the remote object is an object (probably an Error), treat the object like a scope.
                    exceptionText = notification.data.description;
                    scopeObject = notification.data;
                } else {
                    // If it's a value, use a special flag and save the value for later.
                    exceptionText = notification.data.value;
                    scopeObject = <any>{ objectId: WebKitDebugAdapter.EXCEPTION_VALUE_ID };
                    this._exceptionValueObject = notification.data;
                }

                this._currentStack[0].scopeChain.unshift({ type: 'Exception', object: scopeObject });
            }
        } else if (notification.reason == "PauseOnNextStatement") {
            reason = 'pause';
        } else if (notification.reason == "Breakpoint") {
            reason = 'breakpoint';
        } else {
            reason = 'step';
        }

        this.fireEvent(new StoppedEvent(reason, /*threadId=*/WebKitDebugAdapter.THREAD_ID, exceptionText));
    }

    private onDebuggerResumed(): void {
        this._currentStack = null;

        if (!this._expectingResumedEvent) {
            // This is a private undocumented event provided by VS Code to support the 'continue' button on a paused Chrome page
            let resumedEvent: DebugProtocol.Event = { seq: 0, type: 'event',  event: 'continued', body: { threadId: WebKitDebugAdapter.THREAD_ID }};
            this.fireEvent(resumedEvent);
        } else {
            this._expectingResumedEvent = false;
        }
    }

    private onScriptParsed(script: Webkit.Debugger.ScriptParsedEventArgs): void {
        this._scriptsById.set(script.scriptId, script);

        if (this.scriptIsNotAnonymous(script)) {
            this.fireEvent({ seq: 0, type: 'event',  event: 'scriptParsed', body: { scriptUrl: script.url, sourceMapURL: script.sourceMapURL }});
        }
    }

    private onBreakpointResolved(params: Webkit.Debugger.BreakpointResolvedEventArgs): void {
        const script = this._scriptsById.get(params.location.scriptId);
        if (!script) {
            // Breakpoint resolved for a script we don't know about
            return;
        }

        const committedBps = this._committedBreakpointsByUrl.get(script.url) || [];
        committedBps.push(params.breakpointId);
        this._committedBreakpointsByUrl.set(script.url, committedBps);
    }

    private onConsoleMessage(params: Webkit.Console.MessageAddedEventArgs): void {
        let localMessage = params.message;
        let isClientPath = false;
        if (localMessage.url)
        {
            const clientPath = utils.webkitUrlToClientPath(this._request.args.appRoot, this._request.args.platform, localMessage.url);
            if (clientPath !== '') {
                localMessage.url = clientPath;
                isClientPath = true;
            }
        }

        const formattedMessage = formatConsoleMessage(localMessage, isClientPath);
        if (formattedMessage) {
            let outputEvent: OutputEvent = new OutputEvent(formattedMessage.text + '\n', formattedMessage.isError ? 'stderr' : 'stdout');
            this._lastOutputEvent = outputEvent;
            this.fireEvent(outputEvent);
        }
    }

    public onMessageRepeatCountUpdated(params: Webkit.Console.MessageRepeatCountUpdatedEventArgs) {
        if (this._lastOutputEvent) {
            this.fireEvent(this._lastOutputEvent);
        }
    }

    public disconnect(): Promise<void> {
        this.clearEverything();

        return Promise.resolve<void>();
    }

    public setBreakpoints(args: DebugProtocol.ISetBreakpointsArgs): Promise<DebugProtocol.ISetBreakpointsResponseBody> {
        let targetScriptUrl: string;
        if (args.source.path) {
            targetScriptUrl = args.source.path;
        } else if (args.source.sourceReference) {
            const targetScript = this._scriptsById.get(sourceReferenceToScriptId(args.source.sourceReference));
            if (targetScript) {
                targetScriptUrl = targetScript.url;
            }
        }

        if (targetScriptUrl) {
            // DebugProtocol sends all current breakpoints for the script. Clear all scripts for the breakpoint then add all of them
            const setBreakpointsPFailOnError = this._setBreakpointsRequestQ
                .then(() => this._clearAllBreakpoints(targetScriptUrl))
                .then(() => this._addBreakpoints(targetScriptUrl, args))
                .then(responses => ({ breakpoints: this._webkitBreakpointResponsesToODPBreakpoints(targetScriptUrl, responses, args.lines) }));

            const inDebug = typeof (<any>global).v8debug === 'object';
            console.log("InDebug: " + inDebug);
            const setBreakpointsPTimeout = utils.promiseTimeout(setBreakpointsPFailOnError, /*timeoutMs*/inDebug ? 2000000 : 8000, 'Set breakpoints request timed out');

            // Do just one setBreakpointsRequest at a time to avoid interleaving breakpoint removed/breakpoint added requests to Chrome.
            // Swallow errors in the promise queue chain so it doesn't get blocked, but return the failing promise for error handling.
            this._setBreakpointsRequestQ = setBreakpointsPTimeout.catch(() => undefined);
            return setBreakpointsPTimeout;
        } else {
            return utils.errP(`Can't find script for breakpoint request`);
        }
    }

    private _clearAllBreakpoints(url: string): Promise<void> {
        if (!this._committedBreakpointsByUrl.has(url)) {
            return Promise.resolve<void>();
        }

        // Remove breakpoints one at a time. Seems like it would be ok to send the removes all at once,
        // but there is a chrome bug where when removing 5+ or so breakpoints at once, it gets into a weird
        // state where later adds on the same line will fail with 'breakpoint already exists' even though it
        // does not break there.
        return this._committedBreakpointsByUrl.get(url).reduce((p, bpId) => {
            return p.then(() => this._webKitConnection.removeBreakpoint({ breakpointId: bpId })).then(() => { });
        }, Promise.resolve<void>()).then(() => {
            this._committedBreakpointsByUrl.set(url, null);
        });
    }

    private _addBreakpoints(url: string, breakpoints: DebugProtocol.ISetBreakpointsArgs): Promise<Webkit.Debugger.SetBreakpointByUrlResult[]> {
        // Call setBreakpoint for all breakpoints in the script simultaneously
        const responsePs = breakpoints.breakpoints
            .map((b, i) => this._webKitConnection.setBreakpointByUrl({ url: url, lineNumber: breakpoints.lines[i], columnNumber: breakpoints.cols ? breakpoints.cols[i] : 0, options: { condition: b.condition, ignoreCount: parseInt(b.hitCondition) || 0 }}));

        // Join all setBreakpoint requests to a single promise
        return Promise.all(responsePs);
    }

    private _webkitBreakpointResponsesToODPBreakpoints(url: string, responses: Webkit.Response<Webkit.Debugger.SetBreakpointByUrlResult>[], requestLines: number[]): DebugProtocol.IBreakpoint[] {
        // Don't cache errored responses
        const committedBpIds = responses
            .filter(response => !response.error)
            .map(response => response.result.breakpointId);

        // Cache successfully set breakpoint ids from webkit in committedBreakpoints set
        this._committedBreakpointsByUrl.set(url, committedBpIds);

        // Map committed breakpoints to DebugProtocol response breakpoints
        return responses
            .map((response, i) => {
                // The output list needs to be the same length as the input list, so map errors to
                // unverified breakpoints.
                if (response.error || !response.result.locations.length) {
                    return <DebugProtocol.IBreakpoint>{
                        verified: !response.error,
                        line: requestLines[i],
                        column: 0
                    };
                }

                return <DebugProtocol.IBreakpoint>{
                    verified: true,
                    line: response.result.locations[0].lineNumber,
                    column: response.result.locations[0].columnNumber
                };
            });
    }

    public setExceptionBreakpoints(args: DebugProtocol.SetExceptionBreakpointsArguments): Promise<void> {
        let state: string;
        if (args.filters.indexOf('all') >= 0) {
            state = 'all';
        } else if (args.filters.indexOf('uncaught') >= 0) {
            state = 'uncaught';
        } else {
            state = 'none';
        }

        return this._webKitConnection.setPauseOnExceptions({ state: state })
            .then(() => { });
    }

    public continue(): Promise<void> {
        this._expectingResumedEvent = true;
        return this._webKitConnection.resume()
            .then(() => { });
    }

    public next(): Promise<void> {
        this._expectingResumedEvent = true;
        return this._webKitConnection.stepOver()
            .then(() => { });
    }

    public stepIn(): Promise<void> {
        this._expectingResumedEvent = true;
        return this._webKitConnection.stepInto()
            .then(() => { });
    }

    public stepOut(): Promise<void> {
        this._expectingResumedEvent = true;
        return this._webKitConnection.stepOut()
            .then(() => { });
    }

    public pause(): Promise<void> {
        return this._webKitConnection.pause()
            .then(() => { });
    }

    public stackTrace(args: DebugProtocol.StackTraceArguments): DebugProtocol.IStackTraceResponseBody {
        // Only process at the requested number of frames, if 'levels' is specified
        let stack = this._currentStack;
        if (args.levels) {
            stack = this._currentStack.filter((_, i) => args.startFrame <= i && i < args.startFrame + args.levels);
        }

        const stackFrames: DebugProtocol.StackFrame[] = stack
            .map((callFrame: Webkit.Debugger.CallFrame, i: number) => {
                const sourceReference = scriptIdToSourceReference(callFrame.location.scriptId);
                const scriptId = callFrame.location.scriptId;
                const script = this._scriptsById.get(scriptId);

                let source: DebugProtocol.Source;
                if (this.scriptIsNotUnknown(scriptId)) {
                    // We have received Debugger.scriptParsed event for the script.
                    if (this.scriptIsNotAnonymous(script)) {
                        /**
                         * We have received non-empty url with the Debugger.scriptParsed event.
                         * We set the url value to the path property. Later on, the PathTransformer will attempt to resolve it to a script in the app root folder.
                         * In case it fails to resolve it, we also set the sourceReference field in order to allow the client to send source request to retrieve the source.
                         * If the PathTransformer resolves the url successfully, it will change the value of sourceReference to 0.
                         */
                        source = {
                            name: path.basename(script.url),
                            path: script.url,
                            sourceReference: scriptIdToSourceReference(script.scriptId) // will be 0'd out by PathTransformer if not needed
                        };
                    }
                    else {
                        /**
                         * We have received Debugger.scriptParsed event with empty url value.
                         * Sending only the sourceId will make the client to send source request to retrieve the source of the script.
                         */
                        source = {
                            name: 'anonymous source',
                            sourceReference: sourceReference
                        };
                    }
                }
                else {
                    /**
                     * Unknown script. No Debugger.scriptParsed event received for the script.
                     *
                     * Some 'internal scripts' are intentionally referenced by id equal to 0. Others have id > 0 but no Debugger.scriptParsed event is sent when parsed.
                     * In both cases we can't get its source code. If we send back a zero sourceReference the VS Code client will not send source request.
                     * The most we can do is to include a dummy stack frame with no source associated and without specifing the sourceReference.
                     */
                    source = {
                        name: 'unknown source',
                        origin: 'internal module',
                        sourceReference: 0
                    };
                }

                // If the frame doesn't have a function name, it's either an anonymous function
                // or eval script. If its source has a name, it's probably an anonymous function.
                const frameName = callFrame.functionName || (script && script.url ? '(anonymous function)' : '(eval code)');
                return {
                    id: args.startFrame + i,
                    name: frameName,
                    source: source,
                    line: callFrame.location.lineNumber,
                    column: callFrame.location.columnNumber
                };
            });

        return { stackFrames: stackFrames, totalFrames: this._currentStack.length };
    }

    public scopes(args: DebugProtocol.ScopesArguments): DebugProtocol.IScopesResponseBody {
        const scopes = this._currentStack[args.frameId].scopeChain.map((scope: Webkit.Debugger.Scope, i: number) => {
            const scopeHandle: IScopeVarHandle = { objectId: scope.object.objectId };
            if (i === 0) {
                // The first scope should include 'this'. Keep the RemoteObject reference for use by the variables request
                scopeHandle.thisObj = this._currentStack[args.frameId]['this'];
            }

            return <DebugProtocol.Scope>{
                name: scope.type,
                variablesReference: this._variableHandles.create(scopeHandle),
                expensive: scope.type === 'global'
            };
        });

        return { scopes };
    }

    public variables(args: DebugProtocol.VariablesArguments): Promise<DebugProtocol.IVariablesResponseBody> {
        const handle = this._variableHandles.get(args.variablesReference);
        if (handle.objectId === WebKitDebugAdapter.EXCEPTION_VALUE_ID) {
            // If this is the special marker for an exception value, create a fake property descriptor so the usual route can be used
            const excValuePropDescriptor: Webkit.Runtime.PropertyDescriptor = <any>{ name: 'exception', value: this._exceptionValueObject };
            return Promise.resolve({ variables: [this.propertyDescriptorToVariable(excValuePropDescriptor)] });
        } else if (handle != null) {
            return Promise.all([
                // Need to make two requests to get all properties
                this._webKitConnection.getProperties(<any>{ objectId: handle.objectId, ownProperties: false, generatePreview: false, accessorPropertiesOnly: true }),
                this._webKitConnection.getProperties(<any>{ objectId: handle.objectId, ownProperties: true, generatePreview: false, accessorPropertiesOnly: false })
            ]).then(getPropsResponses => {
                // Sometimes duplicates will be returned - merge all property descriptors returned
                const propsByName = new Map<string, Webkit.Runtime.PropertyDescriptor>();
                getPropsResponses.forEach(response => {
                    if (!response.error) {
                        response.result.result.forEach(propDesc =>
                            propsByName.set(propDesc.name, propDesc));
                    }
                });

                // Convert WebKitProtocol prop descriptors to DebugProtocol vars, sort the result
                const variables: DebugProtocol.Variable[] = [];
                propsByName.forEach(propDesc => variables.push(this.propertyDescriptorToVariable(propDesc)));
                variables.sort((var1, var2) => var1.name.localeCompare(var2.name));

                // If this is a scope that should have the 'this', prop, insert it at the top of the list
                if (handle.thisObj) {
                    variables.unshift(this.propertyDescriptorToVariable(<any>{ name: 'this', value: handle.thisObj }));
                }

                return { variables };
            });
        } else {
            return Promise.resolve();
        }
    }

    public source(args: DebugProtocol.SourceArguments): Promise<DebugProtocol.ISourceResponseBody> {
        return this._webKitConnection.getScriptSource({ scriptId: sourceReferenceToScriptId(args.sourceReference) }).then(webkitResponse => {
            if (webkitResponse.error) {
                throw new Error(webkitResponse.error.message);
            }
            return { content: webkitResponse.result.scriptSource };
        });
    }

    public threads(): DebugProtocol.IThreadsResponseBody {
        return {
            threads: [
                {
                    id: WebKitDebugAdapter.THREAD_ID,
                    name: 'Thread ' + WebKitDebugAdapter.THREAD_ID
                }
            ]
        };
    }

    public evaluate(args: DebugProtocol.EvaluateArguments): Promise<DebugProtocol.IEvaluateResponseBody> {
        let evalPromise: Promise<any>;
        if (this.paused) {
            const callFrame = this._currentStack[args.frameId];
            if (!this.scriptIsNotUnknown(callFrame.location.scriptId)) {
                // The iOS debugger backend hangs and stops responding after receiving evaluate request on call frame which has unknown source.
                throw new Error('-'); // The message will be printed in the VS Code UI
            }
            evalPromise = this._webKitConnection.evaluateOnCallFrame({ callFrameId: callFrame.callFrameId, expression: args.expression });
        } else {
            evalPromise = this._webKitConnection.evaluate({ expression: args.expression });
        }

        return evalPromise.then(evalResponse => {
            if (evalResponse.result.wasThrown) {
                const errorMessage = evalResponse.result.exceptionDetails ? evalResponse.result.exceptionDetails.text : 'Error';
                return utils.errP(errorMessage);
            }

            const { value, variablesReference } = this.remoteObjectToValue(evalResponse.result.result);
            return { result: value, variablesReference };
        });
    }

    private propertyDescriptorToVariable(propDesc: Webkit.Runtime.PropertyDescriptor): DebugProtocol.Variable {
        if (propDesc.get || propDesc.set) {
            // A property doesn't have a value here, and we shouldn't evaluate the getter because it may have side effects.
            // Node adapter shows 'undefined', Chrome can eval the getter on demand.
            return { name: propDesc.name, value: 'property', variablesReference: 0 };
        } else {
            const { value, variablesReference } = this.remoteObjectToValue(propDesc.value);
            return { name: propDesc.name, value, variablesReference };
        }
    }

    /**
     * Run the object through Utilities.remoteObjectToValue, and if it returns a variableHandle reference,
     * use it with this instance's variableHandles to create a variable handle.
     */
    private remoteObjectToValue(object: Webkit.Runtime.RemoteObject): { value: string, variablesReference: number } {
        const { value, variableHandleRef } = utils.remoteObjectToValue(object);
        const result = { value, variablesReference: 0 };
        if (variableHandleRef) {
            result.variablesReference = this._variableHandles.create({ objectId: variableHandleRef });
        }

        return result;
    }

    // Returns true if the script has url supplied in Debugger.scriptParsed event
    private scriptIsNotAnonymous(script: Webkit.Debugger.ScriptParsedEventArgs): boolean {
        return script && !!script.url;
    }

    // Returns true if Debugger.scriptParsed event is received for the provided script id
    private scriptIsNotUnknown(scriptId: Webkit.Debugger.ScriptId): boolean {
        return !!this._scriptsById.get(scriptId);
    }
}

function scriptIdToSourceReference(scriptId: Webkit.Debugger.ScriptId): number {
    return parseInt(scriptId, 10);
}

function sourceReferenceToScriptId(sourceReference: number): Webkit.Debugger.ScriptId {
    return '' + sourceReference;
}
