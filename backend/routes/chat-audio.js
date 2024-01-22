const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');
const { ALGORITHMS } = require('../core/auth/constants');
const { getSecret } = require('../core/auth/helpers');

// sound
const sound = require("sound-play");
const path = require('path');
const fs = require('fs');


const { 
    __CHAT_STATIC_RESOURCES_DIR
} = require('../core/socket/constants');



// Add a binding to handle '/chat-audio'
router.get('/', jwt({ secret: getSecret, algorithms: ALGORITHMS }), async (req, res) => {

    const { symbol } = req.query;

    try {

        const fileName = `${symbol}.mp3`;

        const sendAudioPath = path.join(__dirname, `../../${__CHAT_STATIC_RESOURCES_DIR}/audios/${fileName}`);
        
        if (fs.existsSync(sendAudioPath)) {
            sound.play(sendAudioPath);
        }

        return res.json({});

    } catch (err) {
        res.status(500).send({
            "message": err.toString(),
            "code": 500
        });
    }

});

module.exports = router;