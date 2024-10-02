/* eslint-disable @typescript-eslint/no-namespace */

import { Uri } from 'vscode';
import { PythonProject } from './types';

export namespace EnvsExtensionCommands {
    export const RUN_IN_TERMINAL = 'python-envs.runInTerminal';
    export const RUN_AS_TASK = 'python-envs.runAsTask';
}

export interface PythonTerminalExecutionOptions {
    project: PythonProject;
    args: string[];
    useDedicatedTerminal?: Uri;
}

export interface PythonTaskExecutionOptions {
    project: PythonProject;
    args: string[];
    cwd?: string;
    env?: { [key: string]: string | undefined };
    name: string;
}
