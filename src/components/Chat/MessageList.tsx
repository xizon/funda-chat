function MessageList(props: any) {

    const {
        currentUser,
        currentChannel,
        data
    } = props;


    return (
        <>
            {data ? data.filter((v: any) => v.channel === currentChannel).map((item: any, i: number) => (
                <div className="app-chat__msglist-item" key={'chat-msg-' + i}>
                    {/*///////////// CONTENT BEGIN //////////// */}
                    <div className={`app-chat__media ${item.user !== currentUser ? 'app-chat__left' : 'flex-row-reverse app-chat__right'}`}>
                        <div className="app-chat__image-user"><img alt={item.user} src={item.avatar} /><small>{item.user}</small></div>
                        <div className="app-chat__media-body">
                            <div className="app-chat__msg-wrapper" dangerouslySetInnerHTML={{ __html: `${item.text}` }}>
                            </div>
                            <div className="app-chat__msg-time">
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                    {/*///////////// CONTENT END //////////// */}
                </div>

            )) : null}



        </>
    )
}



export default MessageList;