/*
 * Title: Not found handler
 * Description: 404 not found Handler
 * Author: Joyanta Mondal
 * Date: 25/05/2022
 */
// module scaffolding
const handler = {};
handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, { message: 'Your requested URL not found' });
};
module.exports = handler;
