/*
 * Title: server library
 * Description: server related files
 * Author: Joyanta Mondal
 * Date: 16/06/2022
 */
// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
// const {sendTwilioSms} = require('../helpers/notifications');
// server object- module scaffolding
const server ={};
// //todo delete later
// sendTwilioSms('01711111111','Sabuj',(err)=>{
//     console.log(`This is the error`, err);
//     });
server.config = {
port: 3000,
};
// testing file system
// you can data.create / data.delete call here to see instant result
// create server

server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(server.config.port, () => {
        console.log(`listening to port ${server.config.port}`);
    });
};
// handle Request Response
server.handleReqRes = handleReqRes;
// start the server
server.init =()=>{
    server.createServer();
};
//export 
module.exports = server; 
