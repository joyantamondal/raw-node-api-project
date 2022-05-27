/*
 * Title: Uptime monitoring application
 * Description: A RESTFUL API to monitor up or down time of user defined links
 * Author: Joyanta Mondal
 * Date: 25/05/2022
 */
// dependencies

const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// app object- module scaffolding
const app = {};
// testing file system
// @TODO:pore muse dibo
data.read('test', 'newFile', (err, data) => {
    console.log(err, data);
});
// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};
// handle Request Response
app.handleReqRes = handleReqRes;
// start the server
app.createServer();
