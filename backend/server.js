const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const leaveRoom = require('./utils/leave_room');

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");


const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//Passport Middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);


const Message = require('./models/Messages');

app.use(cors());

const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});


const CHAT_BOT = 'ChatBot';
let chatRoom = '';
let allUsers = [];
let chatRoomUsers = [];

io.on('connection', (socket) =>{

    //network disconnected
    socket.on('disconnect', () => {
        const user = allUsers.find((user) => user.id === socket.id);
        if(user?.username) {
            allUsers = leaveRoom(socket.id, allUsers);
            _createdtime_ = Date.now();
            socket.to(chatRoom).emit('chatroom_users', allUsers);
            socket.to(chatRoom).emit('receive_message', {
                message:`${user.username} has disconnected from the chat.`,
                _createdtime_:_createdtime_,
                username:CHAT_BOT,
            });
        }
    })

    //leave
    socket.on('leave_room', (data) => {
        const { username, room } = data;
        socket.leave(room);
        const _createdtime_ = Date.now();

        //remove user from memory
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit('chatroom_users', allUsers);
        socket.to(room).emit('receive_message', {
            username:CHAT_BOT,
            message: `${username} has left the chat`,
            _createdtime_:_createdtime_
        });
    })

    socket.on('join_room', (data) => {
        const { username, room } = data;
        socket.join(room);
        let _createdtime_ = Date.now();

        //lates 30 messages
        Message.find({room: room}).limit(30)
        .then(messages => {
            if(messages) {
                socket.emit('last_30_messages', messages);
            }
        })
        .catch(err => res.status(404).json())


        socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            _createdtime_:_createdtime_
        });
    
        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            _createdtime_:_createdtime_,
            user_id: socket.id,
        });
    
        //save the new user to room
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room })
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);

        socket.on('send_message', (data) => {
            const { message, username, room, _createdtime_ } = data;
            io.in(room).emit('receive_message', data);
            //save message in the mongoDB
            const newMessage = new Message({
                message: message,
                username: username,
                room: room,
            });
            newMessage
                .save()
                .then()
                .catch(err => console.log(err.response));
        })
    });

});

app.get('/', (req, res) => {
    res.send('Hello world');
});

// //Routes Define
// const messages = require("./routes/api/messages");
// app.use('/api/messages',messages);

server.listen(4000, () => `Server is running on port 4000`);