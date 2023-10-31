import axios from 'axios';
import authMsHeader from '../../utils/ms/auth-ms-header';
axios.defaults.headers = { ...authMsHeader() } as never;

//
import apiUrls from '../../config/apiUrls';


import webIo from '../../utils/custom/io';
import ioListener from '../../utils/custom/io-listener';


const initiateSocket = (nickname: string, channel: string, uid: string | number) => {
    webIo('CHANNEL_JOIN', { 
        name: nickname, 
        channel: channel,
        uid: uid
    }, (error: any) => {
        if (error) {
            console.log(`--> [chat app] ${error}`);
        }
    });
};

const switchChannel = (prevChannel: string, channel: string) => {
    webIo('CHANNEL_SWITCH', { prevChannel, channel });
};


const subscribeData = (msgCallback: any, usersCallback: any) => {

    const socket = ioListener([
        {
            event: 'NEW_MESSAGE',
            callback: (msg: any, socketInstance: any) => {
                const { appId, data, sid } = msg;

                msgCallback(data, appId, sid);
            }
        },
        {
            event: 'CHANNEL_USERS_DATA',
            callback: (msg: any, socketInstance: any) => {
                usersCallback(msg);
            }
        }

    ]);
    
    return socket;


};

const sendMessage = (channel: string, text: string) => {
    webIo('MESSAGE_SEND', { channel, text }, () => {
        // do something
    });
};

const updateUserOnline = (nickname: string, channel: string, cb: any) => {
    webIo('UPDATE_USER_ONLINE', { 
        name: nickname, 
        channel: channel
     }, (latestUsers: any[], latestChannels: any[]) => {
        cb(latestUsers, latestChannels);
    });
};





const quitChat = (nickname: string) => {
    webIo('CHAT_ABORT', { 
        name: nickname
    });
};


const fetchChannels = async () => {
    console.log('--> [chat app] fetchChannels');
    const response = await axios.get(apiUrls.CHAT_GET_CHANNELS);
    return response.data.channels;
};

const fetchChannelMessages = async (channel: string) => {
    console.log('--> [chat app] fetchChannelMessages');
    const response = await axios.get(apiUrls.CHAT_SEND_MESSAGE, { params: {channel}});
    return response.data.allMessages;
};

const getOnlineUsers = async (channel: string) => {
    console.log('--> [chat app] getOnlineUsers');
    const response = await axios.get(apiUrls.CHAT_GET_ONLINE_USERS, { params: {channel}});
    return response.data.onlineUsers;
};

const removeUser = async (sid: string) => {
    console.log('--> [chat app] removeUser');

    if (sid === '') return;


    // get user name from server
    //so something...
    const nickname: any = localStorage.getItem('CHAT_USER');
    quitChat(nickname);

};



const scrollArea = () => {
    setTimeout(() => {
        const chatContentArea = document.querySelector('.app-chat__content-inner') as HTMLDivElement;
        if (chatContentArea !== null) {
            chatContentArea.scrollTo({
                top: chatContentArea.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, 500);
}


const uid = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
};


export {
    initiateSocket,
    switchChannel,
    subscribeData,
    sendMessage,
    fetchChannels,
    fetchChannelMessages,
    getOnlineUsers,
    removeUser,
    updateUserOnline,
    scrollArea,
    quitChat,
    uid
}