const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');


// main configuration
const {
    LANG,
    PORT,
    REQUEST_MAX_LIMIT
} = require('./config/constants');

// chat
const {
    __CHAT_USERS,
    __CHAT_MESSAGES,
    __CHAT_CHANNELS
} = require('./core/socket/constants');


//
const port = PORT;
const app = express();



//add other middleware
// HTTP request logger middleware for node.js
app.use(cors());

// parsing the incoming data
app.use(bodyParser.json({ limit: REQUEST_MAX_LIMIT })); // "limit" is to avoid request errors: PayloadTooLargeError: request entity too large
app.use(bodyParser.urlencoded({ extended: true, limit: REQUEST_MAX_LIMIT }));


// app.use(express.json({ limit: REQUEST_MAX_LIMIT }));
// app.use(express.urlencoded({ extended: true, limit: REQUEST_MAX_LIMIT }));


/*
 ================================================
  SERVICE: Chat
 ================================================
 */
app.use('/chat-messages', require('./routes/chat-messages'));
app.use('/chat-get-channels', require('./routes/chat-get-channels'));
app.use('/chat-get-online-users', require('./routes/chat-get-online-users'));
app.use('/chat-remove-user', require('./routes/chat-remove-user'));



/*
 ================================================
  Memory Management And Garbage Collection
 ================================================
 */
const rule = new schedule.RecurrenceRule(); // every Sunday at 24:00
rule.dayOfWeek = 0;
rule.hour = 23;  
rule.minute = 0;


const job = schedule.scheduleJob(rule, function () {
    console.log('--> [chat app] Auto clear users, messages and channels.');
    __CHAT_USERS.splice(0, __CHAT_USERS.length);
    __CHAT_MESSAGES.splice(0, __CHAT_MESSAGES.length);
    __CHAT_CHANNELS.splice(0, __CHAT_CHANNELS.length);

});


/*
 ================================================
  Error handling (should be written at the end)
 ================================================
 */
 app.use( (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {

        res.status(401).send({
            "message": LANG.en.unauthorized,
            "code": 401
        });
    } else {
        next(err);
    }
});


/*
 ================================================
  SERVICE: WebSocket
 ================================================
 */
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});


io.on('connection', (socket) => {
    require('./plugins/ws').main(socket, io);
});



/*
================================================
 START APP
================================================
*/
require('./plugins/signal');
const server = http.listen(port, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(LANG.en.serverRun, host, port);
});

