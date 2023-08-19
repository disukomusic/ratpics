const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Import the 'path' module
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the root directory
app.use(express.static(__dirname));
app.use('/ratchat', express.static(__dirname)); // Serve ratchat.html under /ratchat path

const userDisplayNames = {};
const userList = [];

io.on('connection', (socket) => {
     socket.on('setDisplayName', (displayName) => {
        userDisplayNames[socket.id] = displayName;
        updateUserList();
        const welcomeMessage = `welcome to the rat chat, ${displayName}!!! ioh boY! i lvoe rats!`;
        socket.emit('chatMessage', { user: 'RAT SYSTEM', message: welcomeMessage });
    });

    socket.on('chatMessage', (message) => {
    const displayName = userDisplayNames[socket.id] || 'anon rat';

    if (message.startsWith('/nick ')) {
        const newDisplayName = message.slice(6).trim();
        if (newDisplayName) {
            const oldDisplayName = displayName;
            userDisplayNames[socket.id] = newDisplayName;
            updateUserList();
            const nameChangeMessage = `${oldDisplayName} BECOMES ${newDisplayName}`;
            io.emit('chatMessage', { user: 'RAT SYSTEM', message: nameChangeMessage });
        }
    } else {
        const chatMessage = { user: displayName, message };
        io.emit('chatMessage', chatMessage);
    }
});

    socket.on('mouseMove', (data) => {
        io.emit('userMouseMove', { clientId: socket.id, x: data.x, y: data.y });
    });

    socket.on('disconnect', () => {
        const disconnectedUserDisplayName = userDisplayNames[socket.id];
        if (disconnectedUserDisplayName) {
            io.emit('userDisconnectMessage', disconnectedUserDisplayName);
            delete userDisplayNames[socket.id];
            updateUserList();
            io.emit('userDisconnected', socket.id);
            console.log('rat is dead he died the', socket.id);
        }
    });
});

function updateUserList() {
    const users = Object.values(userDisplayNames);
    io.emit('updateUserList', users);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`RAT SERVER IS OPEN UNLEASH THE RATS ON PORT ${PORT}`);
});
