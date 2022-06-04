/* eslint-disable prettier/prettier */
/*
 * Title: user handlers
 * Description: handler to handle users related routes
 * Author: Joyanta Mondal
 * Date: 04/06/2022
 */
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
// module scaffolding
const handler = {};
handler.userHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];
    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};
handler._users = {};
handler._users.post = (requestProperties, callback) => {
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgrement = typeof requestProperties.body.tosAgrement === 'boolean' && requestProperties.body.tosAgrement.trim().length > 0 ? requestProperties.body.tosAgrement : false;
    if (firstName && lastName && phone && password && tosAgrement) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err1) => {
            if (err1) {
            // next work if user already not created
            const userObject = {
                firstName,
                lastName,
                phone,
                password: hash(password),
                tosAgrement,

            };
            // store to user to db
            data.create('users', phone, userObject, (err2) => {
            if (!err2) {
                callback(200, {
                message: 'User was created successfully!',
                });
            } else {
                callback(500, { error: 'Could not create user!' });
            }
            });
            } else {
            callback(500, {
            error: 'There was a problem in server side',
            });
            }
        });
    } else {
        callback(400, {
            error: 'Your have a problem in your request',
        });
    }
};
handler._users.get = (requestProperties, callback) => {
    callback(200);
};
handler._users.put = (requestProperties, callback) => {};
handler._users.delete = (requestProperties, callback) => {};
module.exports = handler;
