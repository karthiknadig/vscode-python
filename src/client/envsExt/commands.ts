/* eslint-disable @typescript-eslint/no-namespace */

import { Uri } from 'vscode';
import { PythonEnvironment, PythonProject } from './types';

export namespace EnvsExtensionCommands {
    export const RUN_IN_TERMINAL = 'python-envs.runInTerminal';
}

export interface TerminalPythonExecutionOptions {
    project: PythonProject;
    args: string[];
    useDedicatedTerminal?: Uri;
    environment?: PythonEnvironment;
}
