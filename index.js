/*
 * Title: Initial file
 * Description: Initial file to start the node server and workers
 * Author: Joyanta Mondal
 * Date: 16/06/2022
 */
// dependencies
const server = require('./lib/server');
const workers = require('./lib/worker'); 


// app object- module scaffolding
const app ={};

app.init=()=>{
// start the server 
server.init();
// start the workers 
workers.init();
}

app.init();
module.exports=app;