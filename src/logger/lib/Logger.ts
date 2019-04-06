/**
 * Logging class for the Overnight project. Can print logs to the console
 * or to a file. If you want to print to a file you must specify the full
 * path. If you want to print to a file but no path is specified it will
 * print to /HOME_DIR/overnight.log
 *
 * created by Sean Maxwell Apr 5, 2019
 */

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as colors from 'colors';
import * as util from 'util';


export class Logger {

    private readonly turnOff: boolean;
    private readonly printToFile: string;
    private readonly DEFAULT_FILE_NAME = 'overnight.log';


    constructor(turnOff?: boolean, printToFile?: boolean | undefined | string) { // pull in file path from environment variables
        this.turnOff = turnOff || false;

        if (typeof printToFile === 'string') {
            this.printToFile = printToFile;
        } else if (printToFile === true) {
            this.printToFile = path.join(os.homedir(), this.DEFAULT_FILE_NAME);
        } else {
            this.printToFile = '';
        }
    }


    public info(content: any, printFull?: boolean): void {
        this.printLog(content, printFull || false, 'green');
    }


    public imp(content: any, printFull?: boolean): void {
        this.printLog(content, printFull || false, 'magenta');
    }


    public warn(content: any, printFull?: boolean): void {
        this.printLog(content, printFull || false, 'yellow');
    }


    public err(content: any, printFull?: boolean): void {
        this.printLog(content, printFull || false, 'red');
    }


    private printLog(content: any, printFull: boolean, color: string): void {

        if (this.turnOff) {
            return;
        }
        if (printFull) {
            content = util.inspect(content);
        }

        const time = '[' + new Date().toISOString() + ']: ';
        content = time + content + '\n';

        if (!this.printToFile) {
            content = colors[color](content);
            console.log(content);
        } else {
            this.writeToFile(content);
        }
    }


    private async writeToFile(content: string): Promise<void> {

        try {
            const fileExists = await this.checkExists();

            if (fileExists) {
                await this.appendFile(content);
            } else {
                await this.createNew(content);
            }

        } catch (err) {
            console.error(err);
        }
    }


    private checkExists(): Promise<boolean> {

        return new Promise(resolve => {
            fs.access(this.printToFile, err => resolve(!err));
        });
    }


    private appendFile(content: string): Promise<null | Error> {

        return new Promise((resolve, reject) => {
            fs.appendFile(this.printToFile, content, err => {
                err ? reject(err) : resolve();
            });
        });
    }


    private createNew(content: string): Promise<void | Error> {

        return new Promise((resolve, reject) => {
            fs.writeFile(this.printToFile, content, err => {
                err ? reject(err) : resolve();
            });
        });
    }
}
