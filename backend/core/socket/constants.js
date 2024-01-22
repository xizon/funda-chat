


/**
 * Notification
 */
const EVENT_NOTIFICATION = 'BRIDGE_ALERT';

/**
 * Abort
 */
const EVENT_ABORT = 'DISCONNECT';

/**
 * Chat
 */
const __CHAT_USERS = [];
const __CHAT_MESSAGES = [];
const __CHAT_CHANNELS = [
    {
        id: 1,
        name: "default"
    }
];
const __CHAT_AUTO_LOGOUT_TIME = 1000 * 30;  // seconds
const __CHAT_STATIC_RESOURCES_DIR = 'public/assets';


const NEW_MESSAGE = 'NEW_MESSAGE';
const MESSAGE_SEND = 'MESSAGE_SEND';
const CHAT_ABORT = 'CHAT_ABORT';
const CHANNEL_SWITCH = 'CHANNEL_SWITCH';
const CHANNEL_JOIN = 'CHANNEL_JOIN';
const CHANNEL_USERS_DATA = 'CHANNEL_USERS_DATA';
const UPDATE_USER_ONLINE = 'UPDATE_USER_ONLINE';




module.exports = {
    EVENT_NOTIFICATION,
    EVENT_ABORT,

    // Chat
    __CHAT_USERS,
    __CHAT_MESSAGES,
    __CHAT_CHANNELS,
    __CHAT_AUTO_LOGOUT_TIME,
    __CHAT_STATIC_RESOURCES_DIR,
    NEW_MESSAGE,
    MESSAGE_SEND,
    CHAT_ABORT,
    CHANNEL_SWITCH,
    CHANNEL_JOIN,
    CHANNEL_USERS_DATA,
    UPDATE_USER_ONLINE,
}     
