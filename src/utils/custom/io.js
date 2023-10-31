const { io } = require("socket.io-client");

/**
 * Core Communication with socket.io
 * 
 * @param {String} event 
 * @param {*} data 
 * @param {Function} callback 
 */
const webIo = (event, data, callback = () => void(0)) => {
    const appId = window.location.href.split('//')[1].split('/')[1];
    const sendData = {
        appId: appId,
        sid: 'xxxx-xxxx-xxxx-xxxxxxxx',
        data: data
    };

    const serverPort = 4001;
    const socket = io(typeof serverPort !== 'undefined' ? `${window.location.hostname}:${serverPort}` : window.location.host);
    socket.emit(event, sendData, callback);

}

// node & browser
module.exports = webIo;
