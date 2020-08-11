"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
function execShellCommand(cmd) {
    return new Promise(function (resolve, reject) {
        child_process_1.exec(cmd, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}
exports.execShellCommand = execShellCommand;
function getArgs() {
    var args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(function (arg) {
        if (arg.slice(0, 2) === '--') {
            var longArg = arg.split('=');
            var longArgFlag = longArg[0].slice(2, longArg[0].length);
            var longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        else if (arg[0] === '-') {
            var flags = arg.slice(1, arg.length).split('');
            flags.forEach(function (flag) {
                args[flag] = true;
            });
        }
    });
    return args;
}
exports.getArgs = getArgs;
