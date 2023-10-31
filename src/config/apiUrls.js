
const config = {
    // chat
    "CHAT_GET_CHANNELS": "http://localhost:4001/chat-get-channels",
    "CHAT_SEND_MESSAGE": "http://localhost:4001/chat-messages",
    "CHAT_GET_ONLINE_USERS": "http://localhost:4001/chat-get-online-users",
    "CHAT_REMOVE_USER": "http://localhost:4001/chat-remove-user"
}

const localConfig = {

    // chat
    "CHAT_GET_CHANNELS": "http://localhost:4001/chat-get-channels",
    "CHAT_SEND_MESSAGE": "http://localhost:4001/chat-messages",
    "CHAT_GET_ONLINE_USERS": "http://localhost:4001/chat-get-online-users",
    "CHAT_REMOVE_USER": "http://localhost:4001/chat-remove-user"
};



// Global variables passed from the CORE PROGRAM
const urls = typeof window !== "undefined" && window['NODE_ENV'] && window['NODE_ENV'] === 'production'
? config 
: localConfig;

// node & browser
module.exports = urls;

