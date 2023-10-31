function OnlineUsers(props: any) {

    const {
        selfStr,
        currentUser,
        currentChannel,
        users
    } = props;

    const channelUsers = users.filter((v: any) => v.channel === currentChannel);

   
    return (
        <>
   
            {channelUsers.filter((v: any) => currentUser === v.name).map((item: any) => {
                return (
                    <span
                        key={item.id}
                        className="badge text-wrap d-inline-block me-1 bg-info w-auto"
                    >
                        {selfStr}
                    </span>

                );
            })}
            {channelUsers.filter((v: any) => currentUser !== v.name).map((item: any) => {
                return (
                    <span
                        key={item.id}
                        className="badge text-wrap d-inline-block me-1 bg-secondary"
                    >
                        {item.name}
                    </span>

                );
            })}
        </>
    )
}



export default OnlineUsers;