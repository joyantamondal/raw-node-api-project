/*
 * Title: Routes
 * Description: Application Routes
 * Author: Joyanta Mondal
 * Date: 25/05/2022
 */
// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');

const routes = {
    sample: sampleHandler,
};
module.exports = routes;
