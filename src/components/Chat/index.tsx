/* 
 *************************************
 * <!-- Chat -->
 *************************************
 */
import { useEffect, useState, useRef } from 'react';

import {
    initiateSocket,
    fetchChannels,
    fetchChannelMessages,
    subscribeData,
    quitChat,
    getOnlineUsers,
    updateUserOnline
} from './helpers';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';
import OnlineUsers from './OnlineUsers';


// bootstrap components
import Tooltip from 'funda-ui/Tooltip';
import Scrollbar from 'funda-ui/Scrollbar';


// component styles
import 'funda-ui/Tooltip/index.css';
import 'funda-ui/Scrollbar/index.css';





// store
import chatActions from "../../store/actions/chatActions";


import useFetchData from '../../utils/hooks/useFetchData';
import useThrottle from '../../utils/hooks/useThrottle';
import useEffectOnce from '../../utils/hooks/useEffectOnce';



function Chat(props: any) {


    const {
        user
    } = props;

    // Get store
    const [storeData, fetchStore] = useFetchData([chatActions]);
    const getStoreData = () => {
        const _chatlogged = (storeData as any).chatInitInfo.logged;
        return _chatlogged;
    };



    //
    const uniqueID = '';
    const [show, setShow] = useState<boolean>(false);
    const [scrollbarUpdate, setScrollbarUpdate] = useState<number>(0);
    const [messages, setMessages] = useState<any[]>([]);
    const [currentChannel, setCurrentChannel] = useState<string>('default');
    const [channels, setChannels] = useState<any[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [logged, setLogged] = useState<boolean>(false);
    const [offline, setOffline] = useState<boolean>(false);
    const currentUser = user + uniqueID;
    const logoutBtnRef = useRef<HTMLAnchorElement>(null);
    const [newMessageTotal, setNewMessageTotal] = useState<number>(0);
    const [viewedMessageTotal, setViewedMessageTotal] = useState<number>(0);

    //performance
    const handleUserOnlineStatusSafe = useThrottle((e: any) => {
        handleUserOnlineStatus();
    }, 1000, [logged]);


    // channel
    const prevChannelRef = useRef<string>('');
    useEffect(() => {
        prevChannelRef.current = currentChannel;
    });
    const prevChannel = prevChannelRef.current;


    // chat panel
    function handleShowChat() {
        setShow(!show);

        // reset message count
        if (show && getStoreData()) {
            setNewMessageTotal(0);
            setViewedMessageTotal(0);
        }

        
        
    }

    function handleAbortChat(e: React.MouseEvent | null) {
        if (e !== null) e.preventDefault();
        
        quitChat(currentUser);
        if (typeof fetchStore === 'function') fetchStore();

    }

    function handleLogin(e: any) {
        e.preventDefault();
        if (typeof fetchStore === 'function') fetchStore();


        // join channel and create session
        setCurrentChannel(currentChannel);
        initiateSocket(currentUser, currentChannel, uniqueID);


    }

    function handleUserOnlineStatus() {
        updateUserOnline(currentUser, currentChannel, (users: any[], channels: any[]) => void(0));
    }

    useEffect(() => {

        // offline status
        const offlineEnabled = onlineUsers.findIndex(v => currentUser === v.name)
        setOffline(offlineEnabled !== -1 ? false : true);

    });

    useEffectOnce(() => {
  
        if (!logged) {

            setLogged(true);

            // init channels
            //-----
            fetchChannels().then((res) => {
                setChannels(res);
            });

            // init messages
            //-----
            fetchChannelMessages(currentChannel).then((res) => {
                setMessages(res);

                // read status
                res.forEach((message: any) => {
                    const _usersWhoHaveRead = message.read;
                    if (!_usersWhoHaveRead.includes(currentUser)) {
                        setViewedMessageTotal((prevState) => ++prevState);
                    }
                });


            });

            // init online users
            //-----
            getOnlineUsers(currentChannel).then((res) => {
                setOnlineUsers(res);
            });


            // subscribe messages and users
            //-----
            subscribeData(
                (data: any, appId: string, sid: string) => {
                    const { channel, text } = data;
                    if (currentChannel === channel) {
                        setMessages((messages) => [...messages, text]);
                        setScrollbarUpdate(Math.random());
                        setNewMessageTotal((prevState) => ++prevState);

                    }

                },
                (data: any) => {
                    const { users } = data;
                    setOnlineUsers(users);
                }
            );

        }


    });


    return (
        <>

            <div className={`app-chat-trigger ${show ? 'show' : 'hide'}`} onClick={handleShowChat}>
                <div className={`app-chat-notice-total ${show && getStoreData() ? 'invisible' : '' } ${(viewedMessageTotal + newMessageTotal) > 0 ? 'anim' : ''}`}>{viewedMessageTotal + newMessageTotal}</div>
                
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="#fff" strokeWidth="1.5" />
                    <path opacity="0.5" d="M8 10.5H16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    <path opacity="0.5" d="M8 14H13.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#fff" />
                </svg>
            </div>

            <div className={`app-chat__wrapper ${show ? 'show' : 'hide'} ${!getStoreData() ? '' : 'login-ok'}`} onMouseMove={handleUserOnlineStatusSafe} onMouseLeave={handleUserOnlineStatusSafe}>
                <div className={`card ${!getStoreData() ? 'm-0' : ''}`}>
                    {!getStoreData() ? <>
                        <div className="app-chat__content pt-0">
                            <div className="d-flex flex-column align-items-center justify-content-center h-100">
                                 <p>
                                    <svg width="70px" height="70px" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="#858297" strokeWidth="1.5" />
                                        <path opacity="0.5" d="M8 10.5H16" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M8 14H13.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>

                                 </p>
                                 <p className="text-muted">Multi-user online real-time communication</p>
                                 <button className="btn btn-primary btn-sm" type="button" tabIndex={-1} onClick={handleLogin}>Login</button>

                            </div>
                        </div>
                    </> : <>
                        <div className="app-chat__content pt-0">
                            <div className="app-chat__content-body h-100">
                                <div className="app-chat__header pt-3 d-flex align-items-center justify-content-start align-content-center flex-wrap">
                                    <div className="app-chat__image-user app-chat__image-user--main"><img alt="avatar" src="/assets/images/avatar.jpg" /></div>
                                    <div className="app-chat__msg-name mt-2">
                                        <h6>{currentUser}</h6>
                                        {!offline ? <><span className="app-chat__dot-label bg-success"></span><small className="me-3">online</small></> : <><span className="app-chat__dot-label bg-secondary"></span><small className="me-3 text-warning">offline</small></>}
                                        
                                        <Tooltip
                                            direction="bottom"
                                            size="auto"
                                            content={<>Logging out will not clear the chat history and all chat data will be retained for 7 days.</>}
                                        >
                                            <a ref={logoutBtnRef} href="#" onClick={handleAbortChat}>Logout</a>
                                        </Tooltip>
                                        
                                    </div>
                                    <div className="app-chat__online-users ms-3 border-start ps-2 position-relative">
                                        <div className="app-chat__online-users__title ps-2 w-100 mb-1">
                                            <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.094 21.8795 10.2162 21.6537 9.38161C21.5684 9.06633 21.1987 8.94083 20.9028 9.0791C20.3248 9.34916 19.68 9.5 19 9.5C16.5147 9.5 14.5 7.48528 14.5 5C14.5 4.31996 14.6508 3.67516 14.9209 3.09722C15.0592 2.80131 14.9337 2.4316 14.6184 2.3463C13.7838 2.12048 12.906 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" fill="#1C274C" />
                                                <circle cx="19" cy="5" r="3" fill="#1C274C" />
                                            </svg> online users:
                                        </div>
                                        <Scrollbar
                                            disableArrow
                                        >
                                            <div className="app-chat__online-users__list">
                                                <OnlineUsers
                                                    selfStr="me"
                                                    currentUser={currentUser}
                                                    currentChannel={currentChannel}
                                                    users={onlineUsers}
                                                />
                                            </div>
                                        </Scrollbar>

                                    </div>

                                </div>

                                <div className="flex" >
                                    <Scrollbar
                                        data={scrollbarUpdate}
                                        autoScrollTo="down"
                                    >
                                        <div className="app-chat__content-inner">


                                            {/*///////////// BOUNDARY BEGIN //////////// */}
                                            <label className="app-chat__boundary"><span>messages: {messages.length}, save 7 days</span></label>
                                            {/*///////////// BOUNDARY END //////////// */}

                                            <MessageList
                                                currentUser={currentUser}
                                                currentChannel={currentChannel}
                                                data={messages}
                                            />


                                        </div>
                                    </Scrollbar>
                                    
                                </div>
                                <div className="app-chat__footer">
                                    <SendMessageForm
                                        tip="Enter what you want to say..."
                                        currentUser={currentUser}
                                        currentChannel={currentChannel}
                                    />
                                </div>
                            </div>
                        </div>
                    </>}


                </div>


            </div>

        </>
    )
}



export default Chat;