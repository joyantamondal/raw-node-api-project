/*
 * Title: server library
 * Description: server related files
 * Author: Joyanta Mondal
 * Date: 16/06/2022
 */
// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data'); 
const {parseJSON} = require('../helpers/utilities');
const { stat } = require('fs');
const {sendTwilioSms} = require('../helpers/notifications');


// worker object- module scaffolding
const worker ={};

//lookup all the checks from database
worker.gatherAllChecks = ()=>{
//get all the checks
data.list('checks',(err1,checks)=>{
if(!err1 && checks && checks.length>0){
    checks.forEach(check=>{
    data.read('checks',check,(err2, originalCheckData)=>{
      if(!err2 && originalCheckData){
        // pass the data to the check validator
        worker.validateCheckData(parseJSON(originalCheckData));
    } else{
     console.log('Error: reading one of the checks data!');
    }
    });
    });
}else{
    console.log('Error could not find any checks to process!');
}
});
}

// validate individual check data 
worker.validateCheckData=(originalCheckData)=>{
    let orginalData = originalCheckData;
    if(originalCheckData && originalCheckData.id){
        orginalData.state = typeof(originalCheckData.state)==='string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
        orginalData.lastChecked = typeof(originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;
    // pass to the next process 
    worker.performCheck(orginalData);
    } else{
        console.log('Error: check was invalid or not properly formatted!');
    }
}

//perform check 
worker.performCheck=(originalCheckData)=>{
//prepare the initial check outcome
let checkOutcome = {
    'error': false,
    'responseCode': false
}
// mark the outcome has not been sent yet 
let outcomeSent = false ;
//parse the hostname & full url from original data
const parseUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`,true);
const hostName = parseUrl.hostname;
const path = parseUrl.path;

//construct the request
const requestDetails = {
    'protocol' : originalCheckData.protocol + ':',
    'hostname' : hostName,
    'method' : originalCheckData.method.toUpperCase(),
    path,
    'timeout' : originalCheckData.timeoutSeconds * 1000,
};
const protocolToUse = originalCheckData.protocol ==='http' ? http : https;
let req = protocolToUse.request(requestDetails,(res)=>{
    // grab the status of the response 
    const status = res.statusCode;

    //update the check outcome and pass to the next process 
    checkOutcome.responseCode = status;
    if(!outcomeSent){
    worker.processCheckOutcome(originalCheckData, checkOutcome);
    outcomeSent = true ;
}
});
req.on('error',(e)=>{
    checkOutcome = {
        error: true,
        value: e
    }
    //update the check outcome and pass to the next process 
    if(!outcomeSent){
        worker.processCheckOutcome(originalCheckData, checkOutcome);
        outcomeSent = true ;
    }
});
req.on('timeout',()=>{
    checkOutcome = {
        error: true,
        value: 'timeout'
    }
    //update the check outcome and pass to the next process 
    if(!outcomeSent){
        worker.processCheckOutcome(originalCheckData, checkOutcome);
        outcomeSent = true ;
    }
});
// req send 
req.end();
};
//save checkoutcome to database and send to next process
worker.processCheckOutcome=(originalCheckData, checkOutcome)=>{
//check if check outcome is up or down
let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

// decide wheather we should alert the user or not 
let alertWanted = originalCheckData.lastChecked && originalCheckData.state != state ? true : false;
// update the check data 
let newCheckData = originalCheckData;
newCheckData.state = state;
newCheckData.lastChecked = Date.now();
//update the check to disk
data.update('checks', newCheckData.id, newCheckData,(err)=>{
if(!err){
    if(alertWanted){
        worker.alertUserToStatusChange(newCheckData);
    }
    else{
    console.log('Alert is not needed as there is no state change!');
    }
    // send the checkdata to next process
} else{
    console.log('Error: Tring to save check data of one of the checks');
}
});
};

// send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData)=>{
let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
sendTwilioSms(newCheckData.userPhone,msg,(err)=>{
    if(!err){
    console.log(`User was alerted to a status change via SMS: ${msg}`);
    }else{
        console.log('There was a problem to sending sms to one of the user');
    }
})
}
//timer to execute the workers process onece per minute
worker.loop=()=>{
setInterval(()=>{
    worker.gatherAllChecks();
},5000);
};
// start the workers
worker.init =()=>{
    // execute all the checks 
    worker.gatherAllChecks();

    // call the loop so that checks continue 
    worker.loop();
};
//export 
module.exports = worker; 
