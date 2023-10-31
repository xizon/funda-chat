function Channels(props: any) {

    const {
        channels,
        currentChannel,
        setChannel,
    } = props;


    return (
        <>
            <div className="app-chat__channels">
                {channels.length ? channels.map((c: any) => {
                    return (
                        <span
                            key={c.id}
                            onClick={() => setChannel(c.name)}
                            className={`badge bg-primary text-wrap d-inline-block me-1 ${c.name === currentChannel ? 'active' : ''}`}
                        >
                            {c.name}
                        </span>

                    );
                }) : null}
            </div>
        </>
    )
}



export default Channels;