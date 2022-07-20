import * as fs from "fs";
import * as path from "path";
import ConfigModel from "../models/ConfigModel.js";
import { extname } from "path";
import { logErrorMessage, logMessage } from "./logger.js";

let configModel: ConfigModel| null = null;

function hasNull(target): boolean {
    for (var member in target) {
        if (target[member] == null)
            return true;
    }
    return false;
}

function loadConfig(): ConfigModel {
    try {
        const configPath = fs.realpathSync("./config.json");
        logMessage("[CONFIG] Load config from " + configPath);
        if (fs.existsSync(configPath)) {
            const configContent = fs.readFileSync(configPath).toString();
            configModel = JSON.parse(configContent) as ConfigModel;
        }
        else {
            throw new Error("no config.json");
        }
    }
    catch(e) {
        logErrorMessage(e.stack)
        configModel = null;
    }

    if (configModel == null || hasNull(configModel)) 
        throw new Error("invalid config.json");

    return configModel;
}

export function getConfig(): ConfigModel {
    if (!configModel)
        loadConfig();
    return configModel;
};