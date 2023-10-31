
const { 
    __CHAT_USERS,
    __CHAT_MESSAGES,
    __CHAT_CHANNELS,
    __CHAT_AUTO_LOGOUT_TIME
} = require('./constants');

/**
 * Users
 * -----------------------------
 */

const addUser = ({ id, uid, name, channel, lastTimestamp }) => {
    name = name.trim();
    channel = channel.trim();

    const existingUser = __CHAT_USERS.find((user) => {
        return user.channel === channel && user.name === name
    });

    if (existingUser) {
        return { error: "--> [chat app] User is taken" };
    }
    const user = { 
        id, 
        uid, 
        name, 
        channel, 
        lastTimestamp
    };

    __CHAT_USERS.push(user);
    return { user };

};


const removeUser = (name) => {

    // Remove user from memory
    const index = __CHAT_USERS.findIndex((user) => user.name === name);
    if (index !== -1) __CHAT_USERS.splice(index, 1);
    
    return __CHAT_USERS;
};

const getUserByName = (name) => {
    return __CHAT_USERS.find((user) => user.name === name);
};

const getUsersInRoom = (channel) => {
    const systemTimestamp = Date.now();
    return __CHAT_USERS.filter((user) => user.channel === channel && (systemTimestamp - user.lastTimestamp) < __CHAT_AUTO_LOGOUT_TIME);
};


const updateUserOnlineStatus = (name, channel) => {
    if (typeof name === 'undefined') return getUsersInRoom(channel);

    const currentUser = getUserByName(name);
    
    // Avoid reporting errors and aborting the node process
    if (typeof currentUser !== 'undefined') currentUser.lastTimestamp = Date.now();
    

    return {
        users: getUsersInRoom(channel),
        channels: __CHAT_CHANNELS
    };
};



/**
 * Messages
 * -----------------------------
 */
const addMessage = (data) => {
    __CHAT_MESSAGES.push(data);
    return data;
};

const getChannelMessages = (channel) => {
    return __CHAT_MESSAGES.filter((message) => message.channel === channel);
};
    

const updateMessageReadStatus = (name) => {
    __CHAT_MESSAGES.forEach((message) => {
        message.read = Array.from(new Set([...message.read, name]));
    });
    return __CHAT_MESSAGES;
};



/**
 * Channels
 * -----------------------------
 */
const getChannels = () => __CHAT_CHANNELS;


//
module.exports = {
    // Users
    addUser, 
    removeUser,
    getUserByName, 
    getUsersInRoom,
    updateUserOnlineStatus,

    // Messages
    addMessage,
    getChannelMessages,
    updateMessageReadStatus,


    // Channels
    getChannels

}     
