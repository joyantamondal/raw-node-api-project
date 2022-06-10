/* eslint-disable space-before-blocks */
/*
 * Title: Token Handler
 * Description: Handler to handle token related routes
 * Author: Joyanta Mondal
 * Date: 06/06/2022
 */
// dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');
const { createRandomString } = require('../../helpers/utilities');

// module scaffolding
const handler = {};
handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};
handler._token = {};
handler._token.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashedpassowrd = hash(password);
            if (hashedpassowrd === parseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires,
                };
                // store the token into DB
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Password is invalid! Try Again...',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Your have a problem in your request',
        });
    }
};
handler._token.get = (requestProperties, callback) => {
    // check the id if valid
    const id = typeof requestProperties.queryStringObject.id=== 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        // lokup the token
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            /*
            const id does this kind of parse
            */
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Requested token was not found!',
                    });
            }
        });
    } else {
        callback(404, {
        error: 'Requested token was not found!',
        });
    }
};
handler._token.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
    
    const extend = typeof requestProperties.body.extend === 'boolean' &&
    requestProperties.body.extend === true ? true : false;

    if(id && extend){
        data.read('tokens',id,(err1,tokenData)=>{
            let tokenObject = parseJSON(tokenData);
            if(tokenObject.expires>Date.now()){
                tokenObject.expires= Date.now()+60*60*100;
                //store the updated token
                data.update('tokens',id,tokenObject,(err2)=>{
                if(!err2){
                    callback(200);
                } else{
                    callback(500, {
                        error: 'There was a server side error!',
                        });
                }
                })
            }else{
                callback(400, {
                    error: 'Token already expired',
                    });
            }
        });
    }
    else{
        callback(400, {
            error: 'There was a problem in your request',
            });
    }
};
handler._token.delete = (requestProperties, callback) => {
    // check the token number if valid
const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
if (id) {
    // lookup the user
    data.read('tokens', id, (err1, tokenData) => {
    if (!err1 && tokenData) {
    data.delete('tokens', id, (err2) => {
    if (!err2) {
    callback(200, {
        message: 'Token was deleted successfully!',
    });
    } else {
    callback(500, {
    error: 'There was a server side error',
    });
    }
    });
    } else {
        callback(500, {
        error: 'There was a server side error',
        });
    }
    });
} else {
callback(400, {
error: 'There was a problem in your request',
});
}
};
module.exports = handler;
