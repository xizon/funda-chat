

/**
 * express server
 */
const ACCESS_TOKEN_SECRET = 'Custom_MS_Key_123!';
const ALGORITHMS = ["HS256"];


/**
 * key directory
 */
const __MS_KEY_FILE_NAME = 'nfs/xmhis/temp_backup/secret.key';



module.exports = {
    ACCESS_TOKEN_SECRET,
    ALGORITHMS,
    __MS_KEY_FILE_NAME
}     
