/* eslint-disable prettier/prettier */
/*
 * Title: user handlers
 * Description: handler to handle users related routes
 * Author: Joyanta Mondal
 * Date: 04/06/2022
 */
// dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');
// const {parseJSON}= require('../../helpers/utilities');
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

    const tosAgrement = typeof requestProperties.body.tosAgrement === 'boolean' && requestProperties.body.tosAgrement ? requestProperties.body.tosAgrement : false;
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
    // check the phone number if valid
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        // lokup the user
        data.read('users', phone, (err, usr) => {
            const user = { ...parseJSON(usr) };
            /*
            const user does this kind of parse
            {name: 'abcd', age 23, gender:'male'}
            */
            if (!err && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error: 'Requested user was not found!',
                    });
            }
        });
    } else {
        callback(404, {
        error: 'Requested user was not found!',
        });
    }
};
handler._users.put = (requestProperties, callback) => {
    // check the phone number if valid
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
if (phone) {
    if (firstName || lastName || password) {
        // lookup the user
        data.read('users', phone, (err1, uData) => {
            const userData = { ...parseJSON(uData) };
            if (!err1 && userData) {
                if (firstName) {
                    userData.firstName = firstName;
                }
                if (lastName) {
                    userData.lastName = lastName;
                }
                if (password) {
                    userData.password = hash(password);
                }
                // updated data store to DB
                data.update('users', phone, userData, (err2) => {
                    if (!err2) {
                        callback(200, {
                            error: 'User was updated successfully...',
                            });
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side!',
                            });
                    }
                });
            } else {
                callback(400, {
                    error: 'You have a problem in your request!',
                    });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request!',
            });
    }
} else {
    callback(400, {
    error: 'Invalid Phone Number! Please Try Again...',
    });
}
};
handler._users.delete = (requestProperties, callback) => {
// check the phone number if valid
const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        // lookup the user
        data.read('users', phone, (err1, userData) => {
        if (!err1 && userData) {
        data.delete('users', phone, (err2) => {
        if (!err2) {
        callback(200, {
            message: 'User was deleted successfully!',
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
