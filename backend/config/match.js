/**
 * Image file type and format
 */
const imgTypes = /(jpg|jpeg|png|svg|gif|webp)$/i;

/**
 * Text file type and format
 */
const textTypes = /(json|xml|text)$/i;

/**
 * Backup file
 */
const backupFileTypes = /\.(zip)$/i;

/**
 * Image file type and format (include extension)
 */
const imgIncludeExtTypes = /\.(jpg|jpeg|png|gif|webp)$/i;


/**
 * API file
 */
const apiFileTypes = /\.(js)$/i;


module.exports = {
    imgTypes,
    textTypes,
    imgIncludeExtTypes,
    backupFileTypes,
    apiFileTypes
}     
