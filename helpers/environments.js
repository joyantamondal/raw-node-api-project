/*
 * Title: Environments
 * Description: Handle all environments related things
 * Author: Joyanta Mondal
 * Date: 27/05/2022
 */
// dependencies

// module scaffolding
const environments = {};
environments.staging = { port: 3000, envName: 'staging' };
environments.production = { port: 5000, envName: 'production' };

// determine which environment was passed
const currentEnvironment =    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';
// export corresponding environment object
const environmentToExport =    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;
// export module
module.exports = environmentToExport;
