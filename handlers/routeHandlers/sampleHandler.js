/*
 * Title: Sample handlers
 * Description: Sample Handlers
 * Author: Joyanta Mondal
 * Date: 25/05/2022
 */
// module scaffolding
const handler = {};
handler.sampleHandler = (requestProperties, callback) => {
    callback(200, { message: 'This is sample url' });
};
module.exports = handler;
