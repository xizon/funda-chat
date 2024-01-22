import {
    sendMessage
} from '../../components/Chat/helpers';

/**
 * Send a message from system
 * @param {String} content 
 * @param {*} toUserData 
 */

function sysSend(content, toUserData) {
    let timer;
    const key = 'CHAT_TEMP_MSG';

        
    //Every time this returned function is called, the timer is cleared to ensure that fn is not executed
    clearTimeout(timer);

    // get temp data
    const sysMsgCache = sessionStorage.getItem(key);
    if ( sysMsgCache !== null ) {
        timer = setTimeout(() => {
            sessionStorage.removeItem(key);
        }, 1000);

        return;
    } else {
        sessionStorage.setItem(key, JSON.stringify({
            content,
            toUserData
        }));


        const currentUser = 'SYS';
        const currentChannel = 'default';
        const d = new Date;
        const timeNow = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') + ' ' + [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')].join(':');
    
        const data = {
            channel: currentChannel,
            avatar: "/assets/images/system.jpg",
            user: currentUser,
            text: {
                content,
                toUserData
            },
            date: timeNow,
            read: [currentUser]
        };
    
        sendMessage(currentChannel, data);
    
    }


}

export {
    sysSend
}


