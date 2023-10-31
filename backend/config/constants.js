const { fileSizeMegabytes } = require('./computeds');


/**
 * express server
 */
const PORT = 4001;
const HOST_NAME = 'localhost';


/**
 * request
 */
const REQUEST_MAX_LIMIT = '200mb';


/**
 * upload
 */
const UPLOAD_MAX_SIZE = fileSizeMegabytes(200); //200MB


/**
 * i18n
 */
const LANG = {
    en: {
        serverRun: '> Server on http://%s:%s',
        sendOk: 'OK',
        interrupted: 'Interrupted',
        unauthorized: 'Unauthorized'
    }
}



module.exports = {
    PORT,
    HOST_NAME,
    REQUEST_MAX_LIMIT,
    UPLOAD_MAX_SIZE,
    LANG
}     
