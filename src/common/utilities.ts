/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

// TODO: Some functions can be moved to common.

import * as http from 'http';
import * as os from 'os';
import * as fs from 'fs';
import * as url from 'url';
import * as path from 'path';
import {Version} from './Version';

export const enum Platform {
    Windows, OSX, Linux
}

export function getPlatform(): Platform {
    const platform = os.platform();
    return platform === 'darwin' ? Platform.OSX :
        platform === 'win32' ? Platform.Windows :
            Platform.Linux;
}

/**
 * Node's fs.existsSync is deprecated, implement it in terms of statSync
 */
export function existsSync(path: string): boolean {
    try {
        fs.statSync(path);
        return true;
    } catch (e) {
        // doesn't exist
        return false;
    }
}

/**
 * Returns a reversed version of arr. Doesn't modify the input.
 */
export function reversedArr(arr: any[]): any[] {
    return arr.reduce((reversed: any[], x: any) => {
        reversed.unshift(x);
        return reversed;
    }, []);
}

export function promiseTimeout(p?: Promise<any>, timeoutMs: number = 1000, timeoutMsg?: string): Promise<any> {
    if (timeoutMsg === undefined) {
        timeoutMsg = `Promise timed out after ${timeoutMs}ms`;
    }

    return new Promise((resolve, reject) => {
        if (p) {
            p.then(resolve, reject);
        }

        setTimeout(() => {
            if (p) {
                reject(timeoutMsg);
            } else {
                resolve();
            }
        }, timeoutMs);
    });
}

export function retryAsync(fn: () => Promise<any>, timeoutMs: number): Promise<any> {
    const startTime = Date.now();

    function tryUntilTimeout(): Promise<any> {
        return fn().catch(
            e => {
                if (Date.now() - startTime < timeoutMs) {
                    return tryUntilTimeout();
                } else {
                    return errP(e);
                }
            });
    }

    return tryUntilTimeout();
}

function tryFindSourcePathInNSProject(nsProjectPath: string, additionalFileExtension: string, resorcePath: string) : string {
    let guesses = [];
    const pathParts = resorcePath.split(path.sep);
    let appIndex = pathParts.indexOf("app");
    let isTnsModule = appIndex >= 0 && pathParts.length > appIndex + 1 && pathParts[appIndex + 1] === "tns_modules";
    //let isTnsModule: boolean = (pathParts.length >= 3 && pathParts[0] == '' && pathParts[1] == 'app' && pathParts[2] == 'tns_modules');
    if (isTnsModule) {
        // the file is part of a module, so we search it in '{ns-app}/node_modules/tns-core-modules/' and '{ns-app}/node_modules/'
        let nsNodeModulesPath: string = path.join(nsProjectPath, 'node_modules');
        let tnsCoreNodeModulesPath: string = path.join(nsNodeModulesPath, 'tns-core-modules');

        let modulePath: string = path.join.apply(path, pathParts.slice(appIndex + 2));
        guesses.push(path.join(tnsCoreNodeModulesPath, modulePath));
        guesses.push(path.join(nsNodeModulesPath, modulePath));
    }
    else {
        guesses.push(path.join(nsProjectPath, resorcePath));
    }

    for (var guessPath of guesses) {
        if (existsSync(guessPath)) {
            return canonicalizeUrl(guessPath);
        }

        let extension: string = path.extname(guessPath);
        let platformSpecificPath: string = guessPath.substr(0, guessPath.length - extension.length) + '.' + additionalFileExtension + extension;
        if (existsSync(platformSpecificPath)) {
            return canonicalizeUrl(platformSpecificPath);
        }
    }

    return null;
}

/**
 * Maps a url from webkit to an absolute local path.
 * If not given an absolute path (with file: prefix), searches the current working directory for a matching file.
 * http://localhost/scripts/code.js => d:/app/scripts/code.js
 * file:///d:/scripts/code.js => d:/scripts/code.js
 */
export function webkitUrlToClientPath(webRoot: string, additionalFileExtension: string, aUrl: string): string {
    if (!aUrl) {
        return '';
    }

     // If we don't have the client workingDirectory for some reason, don't try to map the url to a client path
    if (!webRoot) {
        return '';
    }

    aUrl = decodeURI(aUrl);

    // Search the filesystem under the webRoot for the file that best matches the given url
    let pathName = url.parse(canonicalizeUrl(aUrl)).pathname;
    if (!pathName || pathName === '/') {
        return '';
    }

    // Dealing with the path portion of either a url or an absolute path to remote file.
    // Need to force path.sep separator
    pathName = pathName.replace(/\//g, path.sep);
    let nsProjectFile = tryFindSourcePathInNSProject(webRoot, additionalFileExtension, pathName);
    if(nsProjectFile) {
        return nsProjectFile;
    }

    let pathParts = pathName.split(path.sep);
    while (pathParts.length > 0) {
        const clientPath = path.join(webRoot, pathParts.join(path.sep));
        if (existsSync(clientPath)) {
            return canonicalizeUrl(clientPath);
        }

        pathParts.shift();
    }

    //check for {N} android internal files
    pathParts = pathName.split(path.sep);
    while (pathParts.length > 0) {
        const clientPath = path.join(webRoot, "platforms/android/src/main/assets", pathParts.join(path.sep));
        if (existsSync(clientPath)) {
            return canonicalizeUrl(clientPath);
        }

        pathParts.shift();
    }

    return '';
}

/**
 * Infers the device root of a given path.
 * The device root is the parent directory of all {N} source files
 * This implementation assumes that all files are all under one common root on the device
 * Returns all the device parent directories of a source file until the file is found on the client by client path
 */
export function inferDeviceRoot(projectRoot: string, additionalFileExtension: string, aUrl: string): string {
    if (!aUrl) {
        return null;
    }

    // If we don't have the projectRoot for some reason, don't try to map the url to a client path
    if (!projectRoot) {
        return null;
    }

    aUrl = decodeURI(aUrl);

    // Search the filesystem under the webRoot for the file that best matches the given url
    let pathName = url.parse(canonicalizeUrl(aUrl)).pathname;
    if (!pathName || pathName === '/') {
        return null;
    }

    // Dealing with the path portion of either a url or an absolute path to remote file.
    // Need to force path.sep separator
    pathName = pathName.replace(/\//g, path.sep);

    let shiftedParts = [];
    let pathParts = pathName.split(path.sep);
    while (pathParts.length > 0) {
        const clientPath = path.join(projectRoot, pathParts.join(path.sep));
        if (existsSync(clientPath)) {
            //return canonicalizeUrl(clientPath);
            return shiftedParts.join(path.sep).replace(/\\/g, "/");
        }

       let shifted = pathParts.shift();
       shiftedParts.push(shifted);
    }

    //check for {N} android internal files
    shiftedParts = [];
    pathParts = pathName.split(path.sep);
    while (pathParts.length > 0) {
        const clientPath = path.join(projectRoot, "platforms/android/src/main/assets", pathParts.join(path.sep));
        if (existsSync(clientPath)) {
            //return canonicalizeUrl(clientPath);
            return shiftedParts.join(path.sep).replace(/\\/g, "/");
        }

        let shifted = pathParts.shift();
        shiftedParts.push(shifted);
    }

    return null;
}

/**
 * Modify a url either from the client or the webkit target to a common format for comparing.
 * The client can handle urls in this format too.
 * file:///D:\\scripts\\code.js => d:/scripts/code.js
 * file:///Users/me/project/code.js => /Users/me/project/code.js
 * c:\\scripts\\code.js => c:/scripts/code.js
 * http://site.com/scripts/code.js => (no change)
 * http://site.com/ => http://site.com
 */
export function canonicalizeUrl(aUrl: string): string {
    aUrl = aUrl.replace('file:///', '');
    aUrl = stripTrailingSlash(aUrl);

    aUrl = fixDriveLetterAndSlashes(aUrl);
    if (aUrl[0] !== '/' && aUrl.indexOf(':') < 0 && getPlatform() === Platform.OSX) {
        // Ensure osx path starts with /, it can be removed when file:/// was stripped.
        // Don't add if the url still has a protocol
        aUrl = '/' + aUrl;
    }

    return aUrl;
}

/**
 * Ensure lower case drive letter and \ on Windows
 */
export function fixDriveLetterAndSlashes(aPath: string): string {
    if (getPlatform() === Platform.Windows) {
        if (aPath.match(/file:\/\/\/[A-Za-z]:/)) {
            const prefixLen = 'file:///'.length;
            aPath =
                'file:///' +
                aPath[prefixLen].toLowerCase() +
                aPath.substr(prefixLen + 1).replace(/\//g, path.sep);
        } else if (aPath.match(/^[A-Za-z]:/)) {
            // If this is Windows and the path starts with a drive letter, ensure lowercase. VS Code uses a lowercase drive letter
            aPath = aPath[0].toLowerCase() + aPath.substr(1);
            aPath = aPath.replace(/\//g, path.sep);
        }
    }

    return aPath;
}

/**
 * Remove a slash of any flavor from the end of the path
 */
export function stripTrailingSlash(aPath: string): string {
    return aPath
        .replace(/\/$/, '')
        .replace(/\\$/, '');
}

export function remoteObjectToValue(object: Webkit.Runtime.RemoteObject, stringify = true): { value: string, variableHandleRef: string } {
    let value = '';
    let variableHandleRef: string;

    if (object) { // just paranoia?
        if (object && object.type === 'object') {
            if (object.subtype === 'null') {
                value = 'null';
            } else {
                // If it's a non-null object, create a variable reference so the client can ask for its props
                variableHandleRef = object.objectId;
                value = object.description;
            }
        } else if (object && object.type === 'undefined') {
            value = 'undefined';
        } else if (object.type === 'function') {
            const firstBraceIdx = object.description.indexOf('{');
            if (firstBraceIdx >= 0) {
                value = object.description.substring(0, firstBraceIdx) + '{ … }';
            } else {
                const firstArrowIdx = object.description.indexOf('=>');
                value = firstArrowIdx >= 0 ?
                    object.description.substring(0, firstArrowIdx + 2) + ' …' :
                    object.description;
            }
        } else {
            // The value is a primitive value, or something that has a description (not object, primitive, or undefined). And force to be string
            if (typeof object.value === 'undefined') {
                value = object.description;
            } else {
                value = stringify ? JSON.stringify(object.value) : object.value;
            }
        }
    }

    return { value, variableHandleRef };
}

/**
 * A helper for returning a rejected promise with an Error object. Avoids double-wrapping an Error, which could happen
 * when passing on a failure from a Promise error handler.
 * @param msg - Should be either a string or an Error
 */
export function errP(msg: any): Promise<any> {
    let e: Error;
    if (!msg) {
        e = new Error('Unknown error');
    } else if (msg.message) {
        // msg is already an Error object
        e = msg;
    } else {
        e = new Error(msg);
    }

    return Promise.reject(e);
}

/**
 * Helper function to GET the contents of a url
 */
export function getURL(aUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        http.get(aUrl, response => {
            let responseData = '';
            response.on('data', chunk => responseData += chunk);
            response.on('end', () => {
                // Sometimes the 'error' event is not fired. Double check here.
                if (response.statusCode === 200) {
                    resolve(responseData);
                } else {
                    reject(responseData);
                }
            });
        }).on('error', e => {
            reject(e);
        });
    });
}

/**
 * Returns true if urlOrPath is like "http://localhost" and not like "c:/code/file.js" or "/code/file.js"
 */
export function isURL(urlOrPath: string): boolean {
    return urlOrPath && !path.isAbsolute(urlOrPath) && !!url.parse(urlOrPath).protocol;
}

/**
 * Strip a string from the left side of a string
 */
export function lstrip(s: string, lStr: string): string {
    return s.startsWith(lStr) ?
        s.substr(lStr.length) :
        s;
}

export function getInstalledExtensionVersion(): Version {
    return Version.parse(require('../../package.json').version);
}

export function getMinSupportedCliVersion(): Version {
    return Version.parse(require('../../package.json').minNativescriptCliVersion);
}