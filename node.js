const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 3000;


// App setup
const app = express();
app.use(cors());
// Server setup for socket
const server = app.listen(PORT, () => console.log('listening to requests on port ', PORT));

// Static files: middleware che serve sempre pagina html cercandola nella pagina public

app.use(express.static('public'));

// Socket setup
const io = socket(server);

// triggered when someone connects, 'socket' is a reference to the socket opened with a client
// each client owns his socket
io.on('connection', (socket) => {
    console.log("made socket connection", socket.id);

    // when this particular socket receive something
    // i'm waiting a message: name of the message is 'chat', data is the data into a chat message
    socket.on('chat', (data) => {
        // message received will be sent back to all clients, also to the one that has sent it because it must display it as well
        // io.sockets: all sockets connected
        io.sockets.emit('chat-response', data);
        console.log(data);
    })


    socket.on('typing', (data) => {
        // data will be sant back to all sockets except the one that has sent it
        socket.broadcast.emit('typing-broadcast', data);
        console.log(data);
    })
});


