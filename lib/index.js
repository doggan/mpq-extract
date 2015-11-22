'use strict';

var mpq = require('mech-mpq'),
    readline = require('readline'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp');

function extractFile(archive, fileName) {
    var file = archive.openFile(fileName);
    if (!file) {
        return null;
    }
    var fileContents = file.read();
    file.close();
    return fileContents;
}

function writeFile(buffer, fileName, options) {
    if (options.useFullPath) {
        fileName = fileName.replace(/\\/g, '/');
    } else {
        var parts = fileName.split("\\");
        if (parts.length > 1) {
            fileName = parts[parts.length - 1];
        }
    }
    if (options.toLowercase) {
        fileName = fileName.toLowerCase();
    }
    var outPath = path.join(options.outPath, fileName);

    mkdirp(path.dirname(outPath), function() {
        fs.writeFile(outPath, buffer, function(err) {
            if (err) {
                console.error('Unable to write: ' + outPath);
            }
        });
    });
}

exports.extract = function(options) {
    console.log('Extracting from: ' + options.mpqPath);

    var hrstart = process.hrtime();

    var archive = mpq.openArchive(options.mpqPath);

    var rl = readline.createInterface({
        input: fs.createReadStream(options.listPath)
    });

    var extractedCount = 0;
    var failedCount = 0;
    rl.on('line', function (line) {
        var contents = extractFile(archive, line);
        if (contents === null) {
            failedCount++;
            if (options.verbose) {
                console.error('Failed to extract: ' + line);
            }
        } else {
            extractedCount++;
            writeFile(contents, line, options);
        }
    }).on('close', function() {
        var hrend = process.hrtime(hrstart);
        console.log('Extraction completed.');
        console.log('...Extracted: ' + extractedCount);
        console.log('...Failed   : ' + failedCount);
        console.log("...Time     : %ds", (hrend[0] + (hrend[1] / 1000000000)).toFixed(2));
    });
};
