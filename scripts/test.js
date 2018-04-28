/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
*/


'use strict';

let configFile;
let networkFile;
let path = require('path');
let fs = require('fs-extra');
function setConfig(file) {
    configFile = path.join('../..', file);
}

function setNetwork(file) {
    networkFile = path.join('../..', file);
}

function main() {
    if(process.argv.length < 3) {
        console.log('undefined benchmark name, should be "npm test -- benchmark-name [options]"');
        return;
    }

    let benchmark = process.argv[2];
    let runDir = path.join(__dirname, '../benchmark', benchmark);
    if(!fs.existsSync(runDir)) {
        console.log('directory ' + runDir + ' does not exist');
        return;
    }

    let runExe = path.join(runDir, 'main.js');
    if(!fs.existsSync(runExe)) {
        console.log('file ' + runExe + ' does not exist');
        return;
    }

    let program = require('commander');
    program
        .option('-c, --config <file>', 'config file of the benchmark', setConfig)
        .option('-n, --network <file>', 'config file of the blockchain system under test', setNetwork)
        .parse(process.argv);
    let cmd = 'node main.js';
    if(typeof configFile === 'string') {
        cmd += ' -c ';
        cmd += configFile;
    }
    if(typeof networkFile === 'string') {
        cmd += ' -n ';
        cmd += networkFile;
    }

    let childProcess = require('child_process');
    let exec = childProcess.exec;
    let run = exec(cmd, {cwd: runDir});
    run.stdout.pipe(process.stdout);
    run.stderr.pipe(process.stderr);
}

main();