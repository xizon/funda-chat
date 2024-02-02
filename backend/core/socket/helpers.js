const path = require('path');
const fs = require('fs');

const { 
    LANG
} = require('../../config/constants');

const { 
    __CHAT_USERS,
    __CHAT_MESSAGES,
    __CHAT_CHANNELS,
    __CHAT_AUTO_LOGOUT_TIME,
    DB_DIR,
    DB_PATH_USERS,
    DB_PATH_MESSAGES,
} = require('./constants');


const { JsonDB, Config } = require('node-json-db');

// The first argument is the database filename. If no extension is used, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you set the second argument to false, you'll have to call the save() method.
// The third argument is used to ask JsonDB to save the database in a human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
const dbUsers = new JsonDB(new Config(DB_PATH_USERS, true, false, '/'));
const dbMsg = new JsonDB(new Config(DB_PATH_MESSAGES, true, false, '/'));


// Pushing the data into the database
// initialize file content: `{"list":[]}`
const dbUsersFilePath = path.resolve(__dirname, `../../../${DB_PATH_USERS}.json`);
const dbMsgFilePath = path.resolve(__dirname, `../../../${DB_PATH_MESSAGES}.json`);
if (!fs.existsSync(dbUsersFilePath)) {
    dbUsers.push("/list", []).then(() => {
        console.log('-->  [db] initialize users database ok')
    });
}

if (!fs.existsSync(dbMsgFilePath)) {
    dbMsg.push("/list", []).then(() => {
        console.log('-->  [db] initialize messages database ok')
    });
}



/* Example:

// Pushing the data into the database
// initialize file content: `{"list":[]}`
dbUsers.push("/list", []).then(() => {
    console.log('-->  [db] initialize users database ok')
});

dbMsg.push("/list", []).then(() => {
    console.log('-->  [db] initialize messages database ok')
});


// `{"list":["aaaa"]}`
dbUsers.push("/list[]", 'aaaa').then(() => {
    console.log('-->  [db] add new user')
});

dbUsers.push("/list[]", 'aaaa').then(() => {
    console.log('-->  [db] add new user')
});


dbUsers.getObject("/list").then((res) => {

    // [ 'aaaa', 'aaaa' ]
    console.log(res);

    const newData = res;
    res.splice(1,1,'bbb','ccc')

  
    // rewrite new data
    // {"list":["aaaa","bbb","ccc"]}
    dbUsers.push("/list", newData).then(() => {
        console.log('-->  [db] update users database ok')
    });

});

// {}
dbUsers.delete("/list").then((res) => {
    console.log('-->  [db] delete users database ok')
});

*/


/**
 * Delete database files
 * -----------------------------
 */
const deleteDatabaseFiles = () => {

    const databaseFolder = path.resolve(__dirname, `../../../${DB_DIR}/`);
    fs.rm( databaseFolder, { recursive: true }, (err) => {
        if (err) return console.log(err);
        console.log(`\x1b[36m ${LANG.en.delete} \x1b[0m`, `${DB_DIR}/`);
    });
};

const deleteDatabase = async () => {

    await dbUsers.push("/list", []);
    console.log('-->  [db] reset users database ok')
    
    await dbMsg.push("/list", []);
    console.log('-->  [db] reset messages database ok')
    
};

/**
 * Users
 * -----------------------------
 */

const addUser = async ({ id, uid, name, channel, lastTimestamp }) => {
    name = name.trim();
    channel = channel.trim();

    const $usersList = await dbUsers.getObject("/list");

    const existingUser = $usersList.find((user) => {
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

    // add new
    await dbUsers.push("/list[]", user);
    console.log('-->  [db] update users database ok')

    return { user };

};


const removeUser = async (name) => {

    const $usersList = await dbUsers.getObject("/list");
    
    // Remove user from file
    const index = $usersList.findIndex((user) => user.name === name);
    if (index !== -1) $usersList.splice(index, 1);
    
    // rewrite new data
    await dbUsers.push("/list", $usersList);
    console.log('-->  [db] update users database ok')

    return $usersList;
};

const getUserByName = async (name) => {
    const $usersList = await dbUsers.getObject("/list");
    return $usersList.find((user) => user.name === name);
};

const getUsersInRoom = async (channel) => {
    const $usersList = await dbUsers.getObject("/list");

    const systemTimestamp = Date.now();
    return $usersList.filter((user) => user.channel === channel && (systemTimestamp - user.lastTimestamp) < __CHAT_AUTO_LOGOUT_TIME);
};


const updateUserOnlineStatus = async (name, channel) => {
    const res = await getUsersInRoom(channel);
    if (typeof name === 'undefined') return res;

    const currentUser = await getUserByName(name);
    
    // Avoid reporting errors and aborting the node process
    if (typeof currentUser !== 'undefined') currentUser.lastTimestamp = Date.now();
    

    return {
        users: res,
        channels: __CHAT_CHANNELS
    };
};



/**
 * Messages
 * -----------------------------
 */
const addMessage = async (data) => {

    // add new
    await dbMsg.push("/list[]", data);
    console.log('-->  [db] update users database ok')

    return data;
};

const getChannelMessages = async (channel) => {
    
    const $msgList = await dbMsg.getObject("/list");
    return $msgList.filter((message) => message.channel === channel);
};
    

const updateMessageReadStatus = async (name) => {

    const $msgList = await dbMsg.getObject("/list");
    
    $msgList.forEach((message) => {
        message.read = Array.from(new Set([...message.read, name]));
    });
    return $msgList;
};



/**
 * Channels
 * -----------------------------
 */
const getChannels = () => __CHAT_CHANNELS;


//
module.exports = {
    // 
    deleteDatabaseFiles,
    deleteDatabase,
    
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
