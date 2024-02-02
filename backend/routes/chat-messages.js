const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');
const { ALGORITHMS } = require('../core/auth/constants');
const { getSecret } = require('../core/auth/helpers');

const {
    getChannelMessages
} = require('../core/socket/helpers');



// Add a binding to handle '/chat-messages'
router.get('/', jwt({ secret: getSecret, algorithms: ALGORITHMS }), async (req, res) => {

    const channel = req.query.channel;

    try {
        
        const allMessages = await getChannelMessages(channel);
        return res.json({ allMessages });

    } catch (err) {
        res.status(500).send({
            "message": err.toString(),
            "code": 500
        });
    }

});

module.exports = router;