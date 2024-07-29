import chalk from 'chalk/index.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { Logger } from './logger.js';

export function roundDec(float,places){
    return +parseFloat(float).toFixed(places);
}

export class ConfigHelper {
    configFile: string;
    constructor(configFile: string) {
        this.configFile = configFile;
        if (!existsSync(this.configFile)){
            const json = {};
            writeFileSync(this.configFile,JSON.stringify(json,null,4));
            Logger.error(`Config file ${configFile} does not exist, Creating Empty File...`);
        }
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFull(): Record<string, any> {
        return JSON.parse(readFileSync(this.configFile, 'utf-8'));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(key: string): any {
        if (this.getFull()[key] !== null) {
            return this.getFull()[key];
        } else {
            return 'ERROR';
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(key: string, value: any): string {
        if (this.getFull()[key] !== null) {
            const full = this.getFull();
            full[key] = value;
            writeFileSync(
                path.join(this.configFile),
                JSON.stringify(full, null, 4),
            );
            return;
        } else {
            return 'ERROR';
        }
    }
}
