import { exec } from "child_process";

export function execShellCommand(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(cmd, (error: any, stdout: any, stderr: any) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

export function getArgs(): any {
    const args: any = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {
            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2, longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            else if (arg[0] === '-') {
                const flags = arg.slice(1, arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });

    return args;
}