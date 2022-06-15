/*
 * Title: Environments
 * Description: Handle all environments related things
 * Author: Joyanta Mondal
 * Date: 27/05/2022
 */
// dependencies

// module scaffolding
const environments = {};
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'ndfbsdfhuisfsdkjfbdskf',
    maxChecks: 5,
    twilio:{
        fromPhone: '+15017122661',
        accountSid:'AC3839510e8ec863bbc01ea31fe9207eb1',
        authToken: '987873a8160fc99f5cbb4a06019a1d44'
    }
};
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'ndfb489ejrhjdkfnsdkjfbdskf',
    maxChecks: 5,
    twilio:{
        fromPhone: '+15017122661',
        accountSid:'AC3839510e8ec863bbc01ea31fe9207eb1',
        authToken: '987873a8160fc99f5cbb4a06019a1d44'
    }
};

// determine which environment was passed
const currentEnvironment =    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';
// export corresponding environment object
const environmentToExport =    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;
// export module
module.exports = environmentToExport;
