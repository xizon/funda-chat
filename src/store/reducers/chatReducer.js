//initialize state
const initialState = {
    logged: false,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case 'CHAT_LOGGED': {
          return { logged: !state.logged };
        }   
            
        default:
            return state;
    }
};