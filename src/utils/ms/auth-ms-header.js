
/**
 * Add header authorization data
 * @returns {Object}
 */
function authMsHeader() {
    // return authorization header with JWT(JSON Web Token) token
    if (typeof window === 'undefined') return {};

    let user = JSON.parse(localStorage.getItem('MS_DATA_AUTH'));

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}

module.exports = authMsHeader;
