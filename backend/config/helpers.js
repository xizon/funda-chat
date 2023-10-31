/**
 * Determine whether it is String
 */
const dataIsString = (data) => {
    return Object.prototype.toString.call(data) === '[object String]';
};

/**
 * base64 string to buffer
 */
const base64StrToBuffer = (data) => (
    Buffer.from(data, 'base64')
);


/**
 * uint8array to buffer
 */
const uint8arrayToBuffer = (data) => (
    Buffer.from(Uint8Array.from(data))
);


/**
 * binary to base64 string
 */
const binaryToBase64Str = (data) => (
    Buffer.from(data, 'binary').toString('base64')
);



/**
 * File date format
 */
const fileDate = () => {
    const _date = new Date();
    return _date.toISOString().split('T')[0]+_date.toISOString().split('T')[1].replace(/\/|\:/g, '_');   // 2023-08-1808_29_48.261Z
}


/**
 * A simplified format based on ISO 8601
 */
const simpleDate = () => {
    const _date = new Date();
    return _date.toISOString();  //  "2011-10-05T14:48:00.000Z"
}


/**
 * Escape all Unicode (non-ASCII) characters in a string
 */
function escapeUnicode(str) {
    return [...str].map(c => /^[\x00-\x7F]$/.test(c) ? c : c.split("").map(a => "\\u" + a.charCodeAt().toString(16).padStart(4, "0")).join("")).join("");
}

module.exports = {
    dataIsString,
    base64StrToBuffer,
    uint8arrayToBuffer,
    binaryToBase64Str,
    fileDate,
    simpleDate,
    escapeUnicode
}     
