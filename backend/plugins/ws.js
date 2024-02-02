
const {
    EVENT_NOTIFICATION,
    EVENT_ABORT,
    NEW_MESSAGE,
    MESSAGE_SEND,
    CHAT_ABORT,
    CHANNEL_SWITCH,
    CHANNEL_JOIN,
    CHANNEL_USERS_DATA,
    UPDATE_USER_ONLINE
} = require('../core/socket/constants');


const {
    addMessage, 
    addUser, 
    removeUser,
    getUsersInRoom,
    updateUserOnlineStatus,
    updateMessageReadStatus
} = require('../core/socket/helpers');


const main = (socket, io) => {


    //---------------------------
    // Notification
    //---------------------------
    socket.on(EVENT_NOTIFICATION, msg => {
        io.emit(EVENT_NOTIFICATION, msg);
    });


    //---------------------------
    // Abort
    //---------------------------
    socket.on(EVENT_ABORT, msg => {
        const { appId, data } = msg;
        io.emit(EVENT_ABORT, msg);
        if (data.info === true) {
            console.log(data.info);
        }
    });
    //---------------------------
    // Chat
    //---------------------------

    // Join the user to the channel.
    ////////////////
    socket.on(CHANNEL_JOIN, async (msg, callback) => {
        const { appId, data } = msg;
        const { name: nickname, channel: currentChannel, uid } = data;
  
        if (typeof nickname === 'undefined' || typeof currentChannel === 'undefined') return callback('--> [chat app] Cannot read properties of undefined');

        const addUserRes = await addUser({ 
            id: socket.id, 
            lastTimestamp: Date.now(),
            uid: uid,
            name: nickname,
            channel: currentChannel
        });

        const userRoom = await getUsersInRoom(currentChannel);

        const { error, user } = addUserRes;


        // get users from the channel
        io.emit(CHANNEL_USERS_DATA, {
            channel: currentChannel,
            users: userRoom
        });



        if (error) return callback(error);

        // add to channel
        socket.join(currentChannel);

        //
        console.log(`--> [chat app] Session created successfully. (${currentChannel} | ${nickname})`);

    });



    // Handle disconnect
    ////////////////
    socket.on(CHAT_ABORT, async (msg) => {
        const { appId, data } = msg;
        const { name: nickname } = data;
        console.log(`--> [chat app] ${nickname} disconnected`);

        const users = await removeUser(nickname);
        
        io.emit(CHANNEL_USERS_DATA, {
            users: users
        });

        
    });


    // Switch channel
    ////////////////
    socket.on(CHANNEL_SWITCH, msg => {
        const { appId, data } = msg;
        const { prevChannel, channel: currentChannel } = data;
        if (prevChannel) {
            socket.leave(prevChannel);
        }
        if (currentChannel) {
            socket.join(currentChannel);
        }
        console.log(`--> [chat app] Change channel ${prevChannel} to ${currentChannel}`);
    });


    // Send message
    ////////////////
    socket.on(MESSAGE_SEND, async (msg, callback) => {
        const { appId, data } = msg;
        const { channel: currentChannel, text } = data;

        io.emit(NEW_MESSAGE, msg);
        console.log(`--> [chat app] Send successfully. (${currentChannel} | ${JSON.stringify(text)})`);

        //
        await addMessage(text);

        //
        callback();
    });

    // Update user online status
    ////////////////
    socket.on(UPDATE_USER_ONLINE, async (msg, callback) => {
        const { appId, data } = msg;
        const { name: nickname, channel: currentChannel } = data;


        const userOnlineStatusRes = await updateUserOnlineStatus(nickname, currentChannel);
        const { users, channels } = userOnlineStatusRes;

        // update read status
        await updateMessageReadStatus(nickname);

        //
        io.emit(CHANNEL_USERS_DATA, {
            users: users
        });

        //
        callback(users, channels);

        console.log(`--> [chat app] Update user online status. (${nickname})`);

    });
    
    

};


module.exports = {
    main
}     
