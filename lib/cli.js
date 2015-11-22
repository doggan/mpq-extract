#! /usr/bin/env node
'use strict';

var program = require('commander'),
    packageJSON = require('../package.json'),
    app = require('./index.js');

function parseArgs() {
    program
        .version(packageJSON.version)
        .usage('[options] <mpq> <listfile>')
        .option('-o, --dest <path>', 'the folder to extract files to (default: current directory)')
        .option('-f, --fullpath', 'preserve the full path heirarchy of the extracted files.')
        .option('-c, --lowercase', 'convert extracted file paths to lowercase.')
        .option('-v, --verbose', 'verbose output')
        .parse(process.argv);

    if (process.argv.length < 3) {
        console.error('Error: No MPQ file specified.');
        program.help();
    }
    if (process.argv.length < 4) {
        console.error('Error: No listfile specified.');
        program.help();
    }

    return {
        mpqPath: process.argv[2],
        listPath: process.argv[3],
        outPath: program.dest || './',
        useFullPath: program.fullpath || false,
        toLowercase: program.lowercase || false,
        verbose: program.verbose || false,
    };
}

var options = parseArgs();
app.extract(options);
