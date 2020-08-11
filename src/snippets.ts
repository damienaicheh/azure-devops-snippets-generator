import path = require('path');
import fs = require('fs');
import { readFile, readDirectory, createFile } from './helpers/fs-helpers';

export async function genereateSnippets(outputFolder: string, projectFolderName: string) {
    const directoryPath = path.join(__dirname, '..', outputFolder, 'azure-pipelines-tasks/Tasks');
    var filesNames: Promise<string | any>[] = [];

    var folders: string[] = await readDirectory(directoryPath);
    folders.forEach(function (folder) {
        filesNames.push(create(path.join(directoryPath, folder, 'task.json'), folder, projectFolderName));
    });

    return await Promise.all(filesNames);
}

async function create(filePath: string, taskName: string, snippetsFolder: string): Promise<string | undefined> {
    return new Promise(async function (resolve, reject) {
        if (fs.existsSync(filePath)) {
            var taskDefinition = await readFile(filePath);
            if (taskDefinition != undefined) {
                const snippet = formatSnippet(taskDefinition);

                if (snippet != undefined) {
                    var outputSnippetsFolder = path.join(__dirname, '..', snippetsFolder, 'snippets');
                    var taskFileName = `${taskName}.json`;
                    await createFile(outputSnippetsFolder, taskFileName, snippet);
                    resolve(taskFileName);
                }
            }
        }
        return resolve(undefined);
    });
}

function formatSnippet(json: string) {
    const jsonData = JSON.parse(json);

    if (jsonData.deprecated != undefined || jsonData.deprecated == true) {
        return;
    }

    if (jsonData.inputs != undefined) {
        var result = `{\n`;
        result += `"${jsonData.friendlyName}": {\n`;
        result += `"prefix": "ado${jsonData.name}${jsonData.version.Major}",\n`;
        result += `"body": [\n`;
        result += `"- task: ${jsonData.name}@${jsonData.version.Major}",\n`;
        result += `"  inputs:",\n`;

        var requiredIndex = 1;

        for (let input of jsonData.inputs) {
            result += createLine(input, requiredIndex);
            if (input.required) {
                requiredIndex++;
            }
        }

        result += `"$${requiredIndex}"\n`;
        result += `],\n`;
        var description = escapeAllSpecialCaracters(jsonData.description);
        result += `"description": "${description != '' ? description : 'None.'}"\n`;
        result += "}\n";
        result += "}\n";

        return result;
    }
}

function createLine(input: any, index: number): string {
    var line = `"    ${input.required ? '' : '#'}${input.name}: `;

    if (input.defaultValue != undefined && input.defaultValue != '' && input.required) {
        line += `$\{${index}:${escapeAllSpecialCaracters(input.defaultValue)}\} ${displayOptions(input)} # Required `;
    } else if (input.required) {
        line += `$${index} ${displayOptions(input)} # Required `;
        if (input.visibleRule != undefined) {
            line += `when ${input.visibleRule} `;
        }
    } else {
        line += `${displayOptions(input)} # Optional `;
    }

    if (input.helpMarkDown != undefined && input.helpMarkDown != '') {
        line += ` # ${escapeAllSpecialCaracters(input.helpMarkDown)}",\n`;
    } else {
        line += `",\n`;
    }

    return line;
}

function displayOptions(input: any): string {
    if (input.options != undefined) {
        var options = '# Options: ';
        for (var keys = Object.keys(input.options), i = 0, end = keys.length; i < end; i++) {
            options += `'${keys[i]}'`;
            if (i < keys.length - 1) {
                options += `, `;
            }
        }
        return options;
    }
    return '';
}

function escapeAllSpecialCaracters(value: string): string {
    return value != undefined ? value.toString().replace(/\n/g, '').replace(/\\/g, '/\\\/').replace(/"/g, '\\"') : '';
}