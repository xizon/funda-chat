const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');
const { ALGORITHMS } = require('../core/auth/constants');
const { getSecret } = require('../core/auth/helpers');


const {
    removeUser, 
} = require('../core/socket/helpers');


// Add a binding to handle '/chat-remove-user'
router.get('/', jwt({ secret: getSecret, algorithms: ALGORITHMS }), async (req, res) => {

    const nickname = req.query.user;

    try {

        // update users
        const users = removeUser(decodeURI(nickname));

        return res.json({ onlineUsers: users });

    } catch (err) {
        res.status(500).send({
            "message": err.toString(),
            "code": 500
        });
    }

});

module.exports = router;