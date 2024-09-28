import { getExtension } from '../common/vscodeApis/extensionsApi';
import { PythonEnvironmentApi } from './types';

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
            api = extension.exports;
            return api;
        }
    }
    return undefined;
}
