import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'

import {
    // IMPORTANT NOTE:  
    // Please do not use `BrowserRouter`, otherwise routing will not be available in the CORE PROGRAM
    HashRouter as Router
} from "react-router-dom";


import RoutesConfig from './router/routes-config';

// store
import { makeStore } from "./store/createStore";

import './index.scss';

console.log('makeStore(): ', makeStore().getState()); 
/*
{
    "chatInitInfo": {
        "logged": false
    }
}
*/

//
const root = createRoot(
    document.getElementById('root') as HTMLDivElement
);

root.render(
    <React.StrictMode>

        <Provider store={makeStore()}>
            <Router>
                <RoutesConfig />
            </Router>
        </Provider>

    </React.StrictMode>
);