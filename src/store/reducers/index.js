import { combineReducers } from 'redux';
import chatReducer from './chatReducer';



export default combineReducers({
    chatInitInfo: chatReducer
});

//@link to: `src/index.tsx`, src/store/createStore.js`