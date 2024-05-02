// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as cp from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';
import * as rpc from 'vscode-jsonrpc/node';
import { traceVerbose } from '../../logging';
import { isWindows } from '../platform/platformService';
import { createDeferred } from '../utils/async';

const { XDG_RUNTIME_DIR } = process.env;
export function generateRandomPipeName(prefix: string): string {
    // length of 10 picked because of the name length restriction for sockets
    const randomSuffix = crypto.randomBytes(10).toString('hex');
    if (prefix.length === 0) {
        prefix = 'python-ext-rpc';
    }

    if (process.platform === 'win32') {
        return `\\\\.\\pipe\\${prefix}-${randomSuffix}`;
    }

    let result;
    if (XDG_RUNTIME_DIR) {
        result = path.join(XDG_RUNTIME_DIR, `${prefix}-${randomSuffix}`);
    } else {
        result = path.join(os.tmpdir(), `${prefix}-${randomSuffix}`);
    }

    return result;
}

async function mkfifo(fifoPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const proc = cp.spawn('mkfifo', [fifoPath]);
        proc.on('error', (err) => {
            reject(err);
        });
        proc.on('exit', (code) => {
            if (code === 0) {
                resolve();
            }
        });
    });
}

export async function createWriterPipe(pipeName: string): Promise<rpc.MessageWriter> {
    if (isWindows()) {
        const deferred = createDeferred<rpc.MessageWriter>();
        const server = net.createServer((socket) => {
            socket.on('close', () => {
                server.close();
            });
            deferred.resolve(new rpc.SocketMessageWriter(socket, 'utf-8'));
        });
        server.on('error', deferred.reject);
        server.listen(pipeName, () => {
            server.removeListener('error', deferred.reject);
        });
        return deferred.promise;
    }

    await mkfifo(pipeName);
    const writer = fs.createWriteStream(pipeName, {
        encoding: 'utf-8',
    });
    return new rpc.StreamMessageWriter(writer, 'utf-8');
}

export async function createReaderPipe(pipeName: string): Promise<rpc.MessageReader> {
    if (isWindows()) {
        const deferred = createDeferred<rpc.MessageReader>();
        const server = net.createServer((socket) => {
            socket.on('close', () => {
                server.close();
            });
            deferred.resolve(new rpc.SocketMessageReader(socket, 'utf-8'));
        });
        server.on('error', deferred.reject);
        server.listen(pipeName, () => {
            server.removeListener('error', deferred.reject);
        });
        return deferred.promise;
    }

    await mkfifo(pipeName);
    const reader = fs.createReadStream(pipeName, {
        encoding: 'utf-8',
    });
    return new rpc.StreamMessageReader(reader, 'utf-8');
}
