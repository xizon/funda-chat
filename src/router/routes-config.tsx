import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import PageIndex from '../components/PageIndex';
// Avoid ERROR: NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
// replace the fragment with a <div> instead. like this:  return <div><Routes>...</Routes></div>;
const routesConfig = () => {
    return <div>
        <Routes>

            <Route
                path="/"
                element={<Navigate to="/chat-index" />}
            />
            <Route path="/chat-index" element={<PageIndex />} />
           
        </Routes>
    </div>;

}


export default routesConfig;
