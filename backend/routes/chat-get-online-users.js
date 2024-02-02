const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');
const { ALGORITHMS } = require('../core/auth/constants');
const { getSecret } = require('../core/auth/helpers');


const {
    getUsersInRoom, 
} = require('../core/socket/helpers');


// Add a binding to handle '/chat-get-online-users'
router.get('/', jwt({ secret: getSecret, algorithms: ALGORITHMS }), async (req, res) => {

    const channel = req.query.channel;

    try {


        const userRoom = await getUsersInRoom(channel);

        return res.json({ onlineUsers: userRoom });

    } catch (err) {
        res.status(500).send({
            "message": err.toString(),
            "code": 500
        });
    }

});

module.exports = router;