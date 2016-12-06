import {EventEmitter} from 'events';

export abstract class WebKitConnection extends EventEmitter implements Webkit.Debugger.Debugger, Webkit.Runtime.Runtime {
    enable(): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    disable(): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    setBreakpoint(args: Webkit.Debugger.SetBreakpointParams ): Promise<Webkit.Response<Webkit.Debugger.SetBreakpointResult>> {
        throw new Error('Not implemented request.');
    }

    setBreakpointsActive?(args: Webkit.Debugger.SetBreakpointsActiveParams ): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    setBreakpointByUrl(args: Webkit.Debugger.SetBreakpointByUrlParams ): Promise<Webkit.Response<Webkit.Debugger.SetBreakpointByUrlResult>> {
        throw new Error('Not implemented request.');
    }

    removeBreakpoint(args: Webkit.Debugger.RemoveBreakpointParams ): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    stepOver(): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    stepInto(): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    stepOut(): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    pause(): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    resume(): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    getScriptSource(args: Webkit.Debugger.GetScriptSourceParams ): Promise<Webkit.Response<Webkit.Debugger.GetScriptSourceResult>> {
        throw new Error('Not implemented request.');
    }

    setPauseOnExceptions(args: Webkit.Debugger.SetPauseOnExceptionsParams ): Promise<Webkit.Response<any>> {
        throw new Error('Not implemented request.');
    }

    evaluateOnCallFrame(args: Webkit.Debugger.EvaluateOnCallFrameParams ): Promise<Webkit.Response<Webkit.Debugger.EvaluateOnCallFrameResult>> {
        throw new Error('Not implemented request.');
    }

    getProperties?(args: Webkit.Runtime.GetPropertiesParams ): Promise<Webkit.Response<Webkit.Runtime.GetPropertiesResult>> {
        throw new Error('Not implemented request.');
    }

    evaluate?(args: Webkit.Runtime.EvaluateParams ): Promise<Webkit.Response<Webkit.Runtime.EvaluateResult>> {
        throw new Error('Not implemented request.');
    }

    abstract close(): void;
}