// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { commands, extensions, lm } from 'vscode';
import { PythonExtension } from '../api/types';
import { IServiceContainer } from '../ioc/types';
import { InstallPackagesTool } from './installPackagesTool';
import { IExtensionContext } from '../common/types';
import { DisposableStore } from '../common/utils/resourceLifecycle';
import { ENVS_EXTENSION_ID } from '../envExt/api.internal';
import { IDiscoveryAPI } from '../pythonEnvironments/base/locator';
import { ListPythonPackagesTool } from './listPackagesTool';
import { GetExecutableTool } from './getExecutableTool';
import { GetEnvironmentInfoTool } from './getPythonEnvTool';

export function registerTools(
    context: IExtensionContext,
    discoverApi: IDiscoveryAPI,
    environmentsApi: PythonExtension['environments'],
    serviceContainer: IServiceContainer,
) {
    if (extensions.getExtension(ENVS_EXTENSION_ID)) {
        return;
    }
    const contextKey = 'pythonEnvExtensionInstalled';
    commands.executeCommand('setContext', contextKey, false);
    const ourTools = new DisposableStore();
    context.subscriptions.push(ourTools);

    ourTools.add(
        lm.registerTool(GetEnvironmentInfoTool.toolName, new GetEnvironmentInfoTool(environmentsApi, serviceContainer)),
    );
    ourTools.add(
        lm.registerTool(
            GetExecutableTool.toolName,
            new GetExecutableTool(environmentsApi, serviceContainer, discoverApi),
        ),
    );
    ourTools.add(
        lm.registerTool(
            ListPythonPackagesTool.toolName,
            new ListPythonPackagesTool(environmentsApi, serviceContainer, discoverApi),
        ),
    );
    ourTools.add(
        lm.registerTool(
            InstallPackagesTool.toolName,
            new InstallPackagesTool(environmentsApi, serviceContainer, discoverApi),
        ),
    );
    ourTools.add(
        extensions.onDidChange(() => {
            const envExtension = extensions.getExtension(ENVS_EXTENSION_ID);
            if (envExtension) {
                envExtension.activate();
                commands.executeCommand('setContext', contextKey, true);
                ourTools.dispose();
            }
        }),
    );
}
