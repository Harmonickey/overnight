/**
 * Start the sample application for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as path from 'path';
import * as fs from 'fs';
import { LoggerModes } from '@overnightjs/logger';



// Set env variables
const logFilePath = path.join(__dirname, '../sampleProject.log');
process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.Console;
process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP = 'false';


// Remove current log file
(function removeFile() {
    try {
        fs.unlinkSync(logFilePath);
    } catch (e) { return; }
})();



// Import and start Server. Remember, server must
// be imported after configuring env variables
import NormalRouterServer from './NormalRouterServer';
import CustomRouterServer from './CustomRouterServer';

let server;
if (process.argv[2] === 'customRouter') {
    server = new CustomRouterServer();
} else {
    server = new NormalRouterServer();
}
server.start(4000);
