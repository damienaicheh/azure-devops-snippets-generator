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
var fs = require("fs");
var fs_helpers_1 = require("./helpers/fs-helpers");
function genereateSnippets(outputFolder, projectFolderName) {
    return __awaiter(this, void 0, void 0, function () {
        var directoryPath, filesNames, folders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    directoryPath = path.join(__dirname, '..', outputFolder, 'azure-pipelines-tasks/Tasks');
                    filesNames = [];
                    return [4 /*yield*/, fs_helpers_1.readDirectory(directoryPath)];
                case 1:
                    folders = _a.sent();
                    folders.forEach(function (folder) {
                        filesNames.push(create(path.join(directoryPath, folder, 'task.json'), folder, projectFolderName));
                    });
                    return [4 /*yield*/, Promise.all(filesNames)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.genereateSnippets = genereateSnippets;
function create(filePath, taskName, snippetsFolder) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    return __awaiter(this, void 0, void 0, function () {
                        var taskDefinition, snippet, outputSnippetsFolder, taskFileName;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!fs.existsSync(filePath)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, fs_helpers_1.readFile(filePath)];
                                case 1:
                                    taskDefinition = _a.sent();
                                    if (!(taskDefinition != undefined)) return [3 /*break*/, 3];
                                    snippet = formatSnippet(taskDefinition);
                                    if (!(snippet != undefined)) return [3 /*break*/, 3];
                                    outputSnippetsFolder = path.join(__dirname, '..', snippetsFolder, 'snippets');
                                    taskFileName = taskName + ".json";
                                    return [4 /*yield*/, fs_helpers_1.createFile(outputSnippetsFolder, taskFileName, snippet)];
                                case 2:
                                    _a.sent();
                                    resolve(taskFileName);
                                    _a.label = 3;
                                case 3: return [2 /*return*/, resolve(undefined)];
                            }
                        });
                    });
                })];
        });
    });
}
function formatSnippet(json) {
    var jsonData = JSON.parse(json);
    if (jsonData.deprecated != undefined || jsonData.deprecated == true) {
        return;
    }
    if (jsonData.inputs != undefined) {
        var result = "{\n";
        result += "\"" + jsonData.friendlyName + "\": {\n";
        result += "\"prefix\": \"ado" + jsonData.name + jsonData.version.Major + "\",\n";
        result += "\"body\": [\n";
        result += "\"- task: " + jsonData.name + "@" + jsonData.version.Major + "\",\n";
        result += "\"  inputs:\",\n";
        var requiredIndex = 1;
        for (var _i = 0, _a = jsonData.inputs; _i < _a.length; _i++) {
            var input = _a[_i];
            result += createLine(input, requiredIndex);
            if (input.required) {
                requiredIndex++;
            }
        }
        result += "\"$" + requiredIndex + "\"\n";
        result += "],\n";
        var description = escapeAllSpecialCaracters(jsonData.description);
        result += "\"description\": \"" + (description != '' ? description : 'None.') + "\"\n";
        result += "}\n";
        result += "}\n";
        return result;
    }
}
function createLine(input, index) {
    var line = "\"    " + (input.required ? '' : '#') + input.name + ": ";
    if (input.defaultValue != undefined && input.defaultValue != '' && input.required) {
        line += "${" + index + ":" + escapeAllSpecialCaracters(input.defaultValue) + "} " + displayOptions(input) + " # Required ";
    }
    else if (input.required) {
        line += "$" + index + " " + displayOptions(input) + " # Required ";
        if (input.visibleRule != undefined) {
            line += "when " + input.visibleRule + " ";
        }
    }
    else {
        line += displayOptions(input) + " # Optional ";
    }
    if (input.helpMarkDown != undefined && input.helpMarkDown != '') {
        line += " # " + escapeAllSpecialCaracters(input.helpMarkDown) + "\",\n";
    }
    else {
        line += "\",\n";
    }
    return line;
}
function displayOptions(input) {
    if (input.options != undefined) {
        var options = '# Options: ';
        for (var keys = Object.keys(input.options), i = 0, end = keys.length; i < end; i++) {
            options += "'" + keys[i] + "'";
            if (i < keys.length - 1) {
                options += ", ";
            }
        }
        return options;
    }
    return '';
}
function escapeAllSpecialCaracters(value) {
    return value != undefined ? value.toString().replace(/\n/g, '').replace(/\\/g, '/\\\/').replace(/"/g, '\\"') : '';
}
