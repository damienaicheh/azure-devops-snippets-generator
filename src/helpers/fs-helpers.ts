import * as fs from 'fs';
import * as path from 'path';

export function readFile(path: fs.PathLike): Promise<string> {
    return new Promise<string>(function (resolve, reject) {
        fs.readFile(path, { encoding: 'utf-8', flag: 'r' }, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

export function createFile(folderPath: string, fileName: string, content: string) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path.join(folderPath, fileName), content, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function readDirectory(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(path, async (err, folders) => {
            err ? reject(err) : resolve(folders);
        });
    });
}
