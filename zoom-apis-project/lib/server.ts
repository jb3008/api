import app from './app';
import * as express from "express";
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import cors from 'cors';
const PORT = 8082;

// const httpsOptions = {
//     key: fs.readFileSync('./config/key.pem'),
//     cert: fs.readFileSync('./config/cert.pem')
// }

http.createServer(app).listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})