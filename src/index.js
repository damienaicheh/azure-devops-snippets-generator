"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var snippets_1 = require("./snippets");
var Handlebars = require("handlebars");
var fs_helpers_1 = require("./helpers/fs-helpers");
var commands_helpers_1 = require("./helpers/commands-helpers");
var outputFolder = 'out';
var projectFolderName = 'vs-extension';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var projectPath, args, filesNames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Git clone");
                    return [4 /*yield*/, commands_helpers_1.execShellCommand("cd " + outputFolder + " && git clone https://github.com/microsoft/azure-pipelines-tasks.git")];
                case 1:
                    _a.sent();
                    console.log("Git clone done");
                    projectPath = path.join(outputFolder, projectFolderName);
                    args = commands_helpers_1.getArgs();
                    console.log(args);
                    console.log("Create project");
                    return [4 /*yield*/, commands_helpers_1.execShellCommand("cp -r templates " + projectPath)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, commands_helpers_1.execShellCommand("cd " + projectPath + " && mkdir snippets")];
                case 3:
                    _a.sent();
                    console.log("Create project done");
                    console.log("Generate snippets");
                    return [4 /*yield*/, snippets_1.genereateSnippets(outputFolder, projectPath)];
                case 4:
                    filesNames = _a.sent();
                    console.log("Generate snippets done");
                    console.log("Configuration");
                    console.log(filesNames);
                    return [4 /*yield*/, setExtensionConfiguration(args.version, filesNames)];
                case 5:
                    _a.sent();
                    console.log("Configuration done");
                    return [2 /*return*/];
            }
        });
    });
}
function setExtensionConfiguration(version, filesNames) {
    return __awaiter(this, void 0, void 0, function () {
        var vscodeExtensionFolder, packageJsonTemplatePath, source, template, snippets, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vscodeExtensionFolder = path.join(__dirname, '..', outputFolder, projectFolderName);
                    packageJsonTemplatePath = path.join(vscodeExtensionFolder, 'package.json.tmpl');
                    return [4 /*yield*/, fs_helpers_1.readFile(packageJsonTemplatePath)];
                case 1:
                    source = _a.sent();
                    template = Handlebars.compile(source);
                    snippets = [];
                    for (index = 0; index < filesNames.length; index++) {
                        if (filesNames[index] != undefined) {
                            snippets.push(JSON.stringify({
                                "language": "yaml",
                                "path": "./snippets/" + filesNames[index]
                            }));
                        }
                    }
                    return [4 /*yield*/, fs_helpers_1.createFile(vscodeExtensionFolder, 'package.json', template({
                            'version': version,
                            'snippets': snippets
                        }))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, commands_helpers_1.execShellCommand("rm " + packageJsonTemplatePath)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
run();
