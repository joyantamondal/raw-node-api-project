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
    
};
handler._token.put = (requestProperties, callback) => {};
handler._token.delete = (requestProperties, callback) => {};
module.exports = handler;
