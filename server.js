const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

const userDisplayNames = {};
const userList = [];

io.on('connection', (socket) => {
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
    io.emit('userDisconnected', socket.id);
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
