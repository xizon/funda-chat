const { io } = require("socket.io-client");

/**
 * Connection listener with socket.io
 * 
 * @param {Array} {event: String, callback: Function}<Array>
 */
/*
Example:

const socket = ioListener([
    {
        event: 'BRIDGE_ALERT',
        callback: (msg, socketInstance) => {
            console.log(msg);
            // do something
        }
    },
    {
        event: 'DISCONNECT',
        callback: (msg, socketInstance) => {
            console.log(msg);
            socketInstance.disconnect();
        }
    }
]);

// socket.disconnect();

*/
const ioListener = (arr) => {

    let socketInstance = null;

    const serverPort = 4001;
    const socket = io(typeof serverPort !== 'undefined' ? `${window.location.hostname}:${serverPort}` : window.location.host);

    socketInstance = socket;
    
    arr.forEach((item) => {
        socket.on(item.event, function (msg) {
            if (typeof item.callback === 'function') item.callback.call(null, msg, socket);
        });
    });

    return socketInstance;

}

// node & browser
module.exports = ioListener;
