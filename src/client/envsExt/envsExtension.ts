import { Uri } from 'vscode';
import { getExtension } from '../common/vscodeApis/extensionsApi';
import { PythonEnvironmentApi, PythonProject } from './types';
import { TerminalPythonExecutionOptions } from './commands';

export const ENVS_EXTENSION_ID = 'ms-python.vscode-python-envs';

let api: PythonEnvironmentApi | undefined;
export async function getEnvsApi(): Promise<PythonEnvironmentApi | undefined> {
    if (api) {
        return api;
    }
    const extension = getExtension<PythonEnvironmentApi>(ENVS_EXTENSION_ID);
    if (extension) {
        if (!extension.isActive) {
            await extension.activate();
        }
        api = extension.exports;
        return api;
    }
    return undefined;
}

let isInstalled: boolean | undefined;
export function isEnvsExtensionInstalled(): boolean {
    if (isInstalled !== undefined) {
        return !!isInstalled;
    }

    const extension = getExtension<PythonEnvironmentApi>(ENVS_EXTENSION_ID);
    isInstalled = extension && extension.isActive;
    return !!isInstalled;
}

export function getPythonProject(uri: Uri): PythonProject | undefined {
    return api?.getPythonProject(uri);
}

export function getRunInTerminalOptions(uri: Uri, useDedicated: boolean): Uri | TerminalPythonExecutionOptions {
    if (useDedicated) {
        const pr = getPythonProject(uri);
        if (pr) {
            return {
                project: pr,
                args: [uri.fsPath],
                useDedicatedTerminal: uri,
            };
        }
    }
    return uri;
}
