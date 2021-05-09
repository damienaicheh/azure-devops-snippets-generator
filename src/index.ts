import path = require('path');
import { genereateSnippets } from './snippets';
import * as Handlebars from 'handlebars';
import { readFile, createFile } from './helpers/fs-helpers';
import { execShellCommand, getArgs } from './helpers/commands-helpers';

const outputFolder = 'out';
const projectFolderName = 'vs-extension';

async function run() {
    console.log("Git clone");
    await execShellCommand(`cd ${outputFolder} && git clone https://github.com/microsoft/azure-pipelines-tasks.git`);
    console.log("Git clone done");

    var projectPath = path.join(outputFolder, projectFolderName);

    const args = getArgs();
    console.log(args);

    console.log("Create project");
    await execShellCommand(`cp -r templates ${projectPath}`);
    await execShellCommand(`cd ${projectPath} && mkdir snippets`);
    console.log("Create project done");

    console.log("Generate snippets");
    var filesNames = await genereateSnippets(outputFolder, projectPath);
    console.log("Generate snippets done");

    console.log("Configuration");
    console.log(filesNames);
    await setExtensionConfiguration(args.version, filesNames);
    console.log("Configuration done");
}

async function setExtensionConfiguration(version: string, filesNames: string[]) {
    var vscodeExtensionFolder = path.join(__dirname, '..', outputFolder, projectFolderName);
    var packageJsonTemplatePath = path.join(vscodeExtensionFolder, 'package.json.tmpl');

    var source = await readFile(packageJsonTemplatePath);

    var template = Handlebars.compile(source);
    var snippets: Object[] = [];

    for (let index = 0; index < filesNames.length; index++) {
        if (filesNames[index] != undefined) {
            snippets.push(JSON.stringify({
                "language": "yaml",
                "path": `./snippets/${filesNames[index]}`
            }));
        }
    }

    await createFile(vscodeExtensionFolder, 'package.json', template({
        'version': version,
        'snippets': snippets
    }));

    await execShellCommand(`rm ${packageJsonTemplatePath}`);
}

run();