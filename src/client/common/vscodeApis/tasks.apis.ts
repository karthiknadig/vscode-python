/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as vscode from 'vscode';

export function onDidStartTask(listener: (e: vscode.TaskStartEvent) => any): vscode.Disposable {
    return vscode.tasks.onDidStartTask(listener);
}

export function onDidEndTask(listener: (e: vscode.TaskEndEvent) => any): vscode.Disposable {
    return vscode.tasks.onDidEndTask(listener);
}
