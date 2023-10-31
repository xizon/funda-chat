import { useEffect } from "react";
import Chat from '../Chat';


const PageIndex = () => {

    const nickname = `user-${Math.random()}`;

    useEffect(() => {

        // save new user
        localStorage.setItem('CHAT_USER', nickname);

    }, []);


    return (
        <>

              {/*<!-- CHAT -->*/}
              <Chat user={nickname}/>
              {/*<!-- /CHAT -->*/}  

        </>
    );


}



export default PageIndex;


