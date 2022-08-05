// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable no-console */

const chalk = require('chalk');
const concurrently = require('concurrently');

const {makeRunner} = require('./runner.js');
const {getWorkspaceCommands} = require('./utils.js');

async function watchAll(useRunner) {
    const commands = getWorkspaceCommands('run');
    commands.unshift({command: 'npm:run:webapp', name: 'webapp', prefixColor: 'cyan'});

    let outputStream = process.stdout;
    if (useRunner) {
        outputStream = makeRunner(commands);
    }

    if (!useRunner) {
        console.log(chalk.inverse.bold('Watching web app and all subpackages...') + '\n');
    }

    const {result} = concurrently(
        commands,
        {
            killOthers: 'failure',
            outputStream,
        },
    );
    await result;
}

const useRunner = process.argv[2] === '--runner';

watchAll(useRunner);
