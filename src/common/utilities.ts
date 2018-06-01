import {ChildProcess, exec} from 'child_process';
import * as os from 'os';

export function killProcess(childProcess: ChildProcess) : void {
    switch (process.platform) {
        case "win32":
            exec(`taskkill /pid ${childProcess.pid} /T /F`);
            break;

        default:
            childProcess.kill("SIGINT");
            break;
    }
}

export const enum Platform {
    Windows, OSX, Linux
}

export function getPlatform(): Platform {
    const platform = os.platform();
    return platform === 'darwin' ? Platform.OSX :
        platform === 'win32' ? Platform.Windows :
            Platform.Linux;
}
