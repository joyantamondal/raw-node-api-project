/*
 * Title: Uptime monitoring application
 * Description: A RESTFUL API to monitor up or down time of user defined links
 * Author: Joyanta Mondal
 * Date: 25/05/2022
 */
// dependencies

const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const {sendTwilioSms} = require('./helpers/notifications');
// app object- module scaffolding
const app ={};
//todo delete later
sendTwilioSms('01714900040','Sabuj',(err)=>{
    console.log(`This is the error`, err);
    });
 app.config = {
port: 3000,
};
// testing file system
// you can data.create / data.delete call here to see instant result
// create server

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });
};
// handle Request Response
app.handleReqRes = handleReqRes;
// start the server
app.createServer();
