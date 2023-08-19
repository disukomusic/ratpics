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
	console.log('connected rat!!11', socket.id);
    socket.on('setDisplayName', (displayName) => {
        userDisplayNames[socket.id] = displayName;
        updateUserList();
    });

    socket.on('mouseMove', (data) => {
        io.emit('userMouseMove', { clientId: socket.id, x: data.x, y: data.y });
    });

    socket.on('disconnect', () => {
        delete userDisplayNames[socket.id];
        updateUserList();
		console.log('rat is dead he died the', socket.id);
        io.emit('userDisconnected', socket.id);
    });

    socket.on('chatMessage', (message) => {
        const displayName = userDisplayNames[socket.id] || 'Anonymous';
        const chatMessage = { user: displayName, message };
		console.log(chatMessage)
        io.emit('chatMessage', chatMessage);
    });
});

function updateUserList() {
    const users = Object.values(userDisplayNames);
    io.emit('updateUserList', users);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
