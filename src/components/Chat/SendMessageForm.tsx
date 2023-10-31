import { useState } from 'react';

import {
    sendMessage,
    updateUserOnline,
   } from './helpers';

function SendMessageForm(props: any) {

    const {
        tip,
        currentUser,
        currentChannel,
    } = props;

    const [val, setVal] = useState<string>('');

    function handleChange(e: any) {
        setVal(e.target.value);
    }

    function handleSubmit(e: any) {
        e.preventDefault()
        if (val === '') return;

        const d = new Date;
        const timeNow = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') + ' ' + [d.getHours().toString().padStart(2, '0'), d.getMinutes().toString().padStart(2, '0'), d.getSeconds().toString().padStart(2, '0')].join(':');

        const data: any = {
            channel: currentChannel,
            avatar: "/assets/images/avatar.jpg",
            user: currentUser,
            text: val,
            date: timeNow,
            read: [currentUser]
        };
    
        sendMessage(currentChannel, data);
        updateUserOnline(currentUser, currentChannel, (users: any[], channels: any[]) => void(0));
        setVal('');


    }


 
    return (
        <>

            <form className="d-flex w-100">
                <input className="form-control" type="text" placeholder={tip} autoFocus onChange={handleChange} value={val} />
                <button tabIndex={-1} type="submit" className="btn btn-outline-light" onClick={handleSubmit}>
                    <svg width="25px" height="25px" viewBox="0 0 32 32">

                        <path fill="#8f8f8f" d="M30.291,2.87l-9.581,25.26c-0.39,1.029-1.346,1.234-2.123,0.456c0,0-6.036-6.036-6.586-6.586
	s-0.359-1.631,0.425-2.403l13.316-13.11c0.784-0.772,0.711-0.856-0.163-0.187L10.588,17.784c-0.873,0.669-2.224,0.58-3.002-0.198
	l-4.172-4.172c-0.778-0.778-0.573-1.733,0.456-2.124l25.26-9.581C30.159,1.319,30.681,1.841,30.291,2.87z M8.707,20.121
	C8.318,19.732,8,19.864,8,20.414V25c0,0.55,0.386,0.768,0.857,0.485l2.401-1.441c0.472-0.283,0.539-0.833,0.15-1.222L8.707,20.121z"
                        />
                    </svg>
                </button>

            </form>



        </>
    )
}



export default SendMessageForm;