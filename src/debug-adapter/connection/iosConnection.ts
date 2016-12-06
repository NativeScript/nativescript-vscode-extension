/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as net from 'net';
import * as stream from 'stream';
import {EventEmitter} from 'events';
import {WebKitConnection} from './webKitConnection';
import * as utils from '../../common/utilities';
import {Services} from '../../services/debugAdapterServices';
import {Tags} from '../../common/logger';

interface IMessageWithId {
    id: number;
    method: string;
    params?: any;
}

export class PacketStream extends stream.Transform {
	private buffer: Buffer;
	private offset: number;

	constructor(opts?: stream.TransformOptions) {
		super(opts);
	}

	public _transform(packet: any, encoding: string, done: Function): void {
		while (packet.length > 0) {
			if (!this.buffer) {
				// read length
				let length = packet.readInt32BE(0);
				this.buffer = new Buffer(length);
				this.offset = 0;
				packet = packet.slice(4);
			}

			packet.copy(this.buffer, this.offset);
			let copied = Math.min(this.buffer.length - this.offset, packet.length);
			this.offset += copied;
			packet = packet.slice(copied);

			if (this.offset === this.buffer.length) {
				this.push(this.buffer);
				this.buffer = undefined;
			}
		}
		done();
	}
}

/**
 * Implements a Request/Response API on top of a Unix domain socket for messages that are marked with an `id` property.
 * Emits `message.method` for messages that don't have `id`.
 */
class WebKitResReqUnixSocket extends EventEmitter {
    private _pendingRequests = new Map<number, any>();
    private _unixSocketAttached: Promise<net.Socket>;

    /**
     * Attach to the given filePath
     */
    public attach(filePath: string): Promise<void> {
        this._unixSocketAttached = new Promise((resolve, reject) => {

            let unixSocket: net.Socket;
            try {
                unixSocket = net.createConnection(filePath);
                unixSocket.on('connect', () => {
                    resolve(unixSocket);
                });

                unixSocket.on('error', (e) => {
                    reject(e);
                });

                unixSocket.on('close', () => {
                    Services.logger().log('Unix socket closed');
                    this.emit('close');
                });

                let packetsStream = new PacketStream();
                unixSocket.pipe(packetsStream);

                packetsStream.on('data', (buffer: Buffer) => {
                    let packet = buffer.toString('utf16le');
                    Services.logger().log('From target: ' + packet);
                    this.onMessage(JSON.parse(packet));
                });
            } catch (e) {
                // invalid url e.g.
                reject(e.message);
                return;
            }
        });

        return <Promise<void>><any>this._unixSocketAttached;
    }

    public close(): void {
        if (this._unixSocketAttached) {
            this._unixSocketAttached.then(socket => socket.destroy());
        }
    }

    /**
     * Send a message which must have an id. Ok to call immediately after attach. Messages will be queued until
     * the websocket actually attaches.
     */
    public sendMessage(message: IMessageWithId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._pendingRequests.set(message.id, resolve);
            this._unixSocketAttached.then(socket => {
                const msgStr = JSON.stringify(message);
                Services.logger().log('To target: ' + msgStr);
                let encoding = "utf16le";
                let length = Buffer.byteLength(msgStr, encoding);
				let payload = new Buffer(length + 4);
				payload.writeInt32BE(length, 0);
				payload.write(msgStr, 4, length, encoding);
                socket.write(payload);
            });
        });
    }

    private onMessage(message: any): void {
        if (message.id) {
            if (this._pendingRequests.has(message.id)) {
                // Resolve the pending request with this response
                this._pendingRequests.get(message.id)(message);
                this._pendingRequests.delete(message.id);
            } else {
                console.error(`Got a response with id ${message.id} for which there is no pending request, weird.`);
            }
        } else if (message.method) {
            this.emit(message.method, message.params);
        }
    }
}

/**
 * Connects to a target supporting the webkit protocol and sends and receives messages
 */
export class IosConnection extends WebKitConnection {
    private _nextId = 1;
    private _socket: WebKitResReqUnixSocket;

    constructor() {
        super();
        this._socket = new WebKitResReqUnixSocket();
    }

    enable(): Promise<Webkit.Response<any>> {
        return Promise.all([
            this.sendMessage('Debugger.enable'),
            this.sendMessage('Console.enable')]);
    }

    disable(): Promise<Webkit.Response<any>> {
        return Promise.all([
            this.sendMessage('Debugger.disable'),
            this.sendMessage('Console.disable')]);
    }

    setBreakpoint(args: Webkit.Debugger.SetBreakpointParams): Promise<Webkit.Response<Webkit.Debugger.SetBreakpointResult>> {
        return this.sendMessage('Debugger.setBreakpoint', args);
    }

    setBreakpointsActive?(args: Webkit.Debugger.SetBreakpointsActiveParams): Promise<Webkit.Response<any>> {
        return this.sendMessage('Debugger.setBreakpointsActive', args);
    }

    setBreakpointByUrl(args: Webkit.Debugger.SetBreakpointByUrlParams): Promise<Webkit.Response<Webkit.Debugger.SetBreakpointByUrlResult>> {
        return this.sendMessage('Debugger.setBreakpointByUrl', args);
    }

    removeBreakpoint(args: Webkit.Debugger.RemoveBreakpointParams ): Promise<Webkit.Response<any>> {
        return this.sendMessage('Debugger.removeBreakpoint', args);
    }

    stepOver(): Promise<Webkit.Response<any>> {
        return this.sendMessage('Debugger.stepOver');
    }

    stepInto(): Promise<Webkit.Response<any>> {
        return this.sendMessage('Debugger.stepInto');
    }

    stepOut(): Promise<Webkit.Response<any>> {
        return this.sendMessage('Debugger.stepOut');
    }

    pause(): Promise<Webkit.Response<any>> {
        return this.sendMessage('Debugger.pause');
    }

    resume(): Promise<Webkit.Response<any>> {
        return this.sendMessage('Debugger.resume');
    }

    getScriptSource(args: Webkit.Debugger.GetScriptSourceParams): Promise<Webkit.Response<Webkit.Debugger.GetScriptSourceResult>> {
        return this.sendMessage('Debugger.getScriptSource', args);
    }

    setPauseOnExceptions(args: Webkit.Debugger.SetPauseOnExceptionsParams): Promise<Webkit.Response<any>> {
        return this.sendMessage('Debugger.setPauseOnExceptions', args);
    }

    evaluateOnCallFrame(args: Webkit.Debugger.EvaluateOnCallFrameParams): Promise<Webkit.Response<Webkit.Debugger.EvaluateOnCallFrameResult>> {
        return this.sendMessage('Debugger.evaluateOnCallFrame', args);
    }

    getProperties?(args: Webkit.Runtime.GetPropertiesParams): Promise<Webkit.Response<Webkit.Runtime.GetPropertiesResult>> {
        return this.sendMessage('Runtime.getProperties', args);
    }

    evaluate?(args: Webkit.Runtime.EvaluateParams): Promise<Webkit.Response<Webkit.Runtime.EvaluateResult>> {
        return this.sendMessage('Runtime.evaluate', args);
    }

    /**
     * Attach the underlying Unix socket
     */
    public attach(filePath: string): Promise<void> {
        Services.logger().log(`Attempting to attach to path ${filePath}`, Tags.FrontendMessage);
        return utils.retryAsync(() => this._socket.attach(filePath), 6000);
    }

    /**
     * Close the underlying Unix socket
     */
    public close(): void {
        this._socket.close();
    }

    /**
     * Attach listeners for webkit events emitted by the underlying socket
     */
    public on(event: string | symbol, listener: Function): this {
        this._socket.on(event, listener);
        return this;
    }

    /**
     * Sends message over the underlying unix socket
    */
    private sendMessage(method: string, params?: any): Promise<Webkit.Response<any>> {
        return this._socket.sendMessage({
            id: this._nextId++,
            method: method,
            params: params
        });
    }
}
