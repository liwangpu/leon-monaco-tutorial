import { ChildProcess, spawn } from "child_process";
import { Options } from "./options";
import { PlatformInformation } from "./platform";

export enum LaunchTargetKind {
    Solution,
    ProjectJson,
    Folder,
    Csx,
    Cake,
    LiveShare
}

/**
 * Represents the project or solution that OmniSharp is to be launched with.
 * */
export interface LaunchTarget {
    label: string;
    description: string;
    directory: string;
    target: string;
    kind: LaunchTargetKind;
}


export interface LaunchInfo {
    LaunchPath: string;
    MonoLaunchPath?: string;
}

export interface LaunchResult {
    process: ChildProcess;
    command: string;
    monoVersion?: string;
    monoPath?: string;
}


export async function launchOmniSharp(cwd: string, args: string[], launchInfo: LaunchInfo, platformInfo: PlatformInformation, options: Options): Promise<LaunchResult> {
    return new Promise<LaunchResult>((resolve, reject) => {
        launch(cwd, args, launchInfo, platformInfo, options)
            .then(result => {
                // async error - when target not not ENEOT
                result.process.on('error', err => {
                    reject(err);
                });

                // success after a short freeing event loop
                setTimeout(function () {
                    resolve(result);
                }, 0);
            })
            .catch(reason => reject(reason));
    });
}

async function launch(cwd: string, args: string[], launchInfo: LaunchInfo, platformInfo: PlatformInformation, options: Options): Promise<LaunchResult> {
    if (options.useEditorFormattingSettings) {
       
        args.push(`formattingOptions:useTabs=${''}`);
        args.push(`formattingOptions:tabSize=${''}`);
        args.push(`formattingOptions:indentationSize=${''}`);
    }

    if (platformInfo.isWindows()) {
        return launchWindows(launchInfo.LaunchPath, cwd, args);
    }
    else if (platformInfo.isLinux){
        return launchNix(launchInfo.LaunchPath, cwd, args);
    }

  
}


function launchWindows(launchPath: string, cwd: string, args: string[]): LaunchResult {
    function escapeIfNeeded(arg: string) {
        const hasSpaceWithoutQuotes = /^[^"].* .*[^"]/;
        return hasSpaceWithoutQuotes.test(arg)
            ? `"${arg}"`
            : arg.replace("&", "^&");
    }

    let argsCopy = args.slice(0); // create copy of args
    argsCopy.unshift(launchPath);
    argsCopy = [[
        '/s',
        '/c',
        '"' + argsCopy.map(escapeIfNeeded).join(' ') + '"'
    ].join(' ')];

    let process = spawn('cmd', argsCopy, {
        windowsVerbatimArguments: true,
        detached: false,
        cwd: cwd
    });

    return {
        process,
        command: launchPath,
    };
}


function launchNix(launchPath: string, cwd: string, args: string[]): LaunchResult {
    let process = spawn(launchPath, args, {
        detached: false,
        cwd: cwd
    });

    return {
        process,
        command: launchPath
    };
}