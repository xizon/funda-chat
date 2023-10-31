const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');
const { ALGORITHMS } = require('../core/auth/constants');
const { getSecret } = require('../core/auth/helpers');


const {
    __CHAT_CHANNELS, 
} = require('../core/socket/constants');


// Add a binding to handle '/chat-get-channels'
router.get('/', jwt({ secret: getSecret, algorithms: ALGORITHMS }), async (req, res) => {

    try {

        return res.json({ channels: __CHAT_CHANNELS });

    } catch (err) {
        res.status(500).send({
            "message": err.toString(),
            "code": 500
        });
    }

});

module.exports = router;