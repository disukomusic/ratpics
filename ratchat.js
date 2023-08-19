const socket = io('https://quality-mint-snapper.ngrok-free.app', {
    transports: ['websocket']
});
const userDisplayNames = {};

document.addEventListener('DOMContentLoaded', () => {
    const displayName = localStorage.getItem('displayName'); // Retrieve display name from local storage
    const welcomeMessage = `welcome to the rat hangout! ioh boY! i lvoe rats!`;
            socket.emit('chatMessage', welcomeMessage);
			
    if (!displayName) {
        const userInput = prompt('RAT NAME RAT NAME (you can only choose one rat name and it is yours forver)');
        if (userInput) {
            localStorage.setItem('displayName', userInput); // Store display name
            userDisplayNames[socket.id] = userInput;
            socket.emit('setDisplayName', userInput);
			
			 const welcomeMessage = `welcome to the rat chat, ${userInput}!!! ioh boY! i lvoe rats!`;
            socket.emit('chatMessage', welcomeMessage);
        }
    } else {
        userDisplayNames[socket.id] = displayName;
        socket.emit('setDisplayName', displayName);
    }

    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    function addMessage(user, message) {
        const messageElement = document.createElement('div');
        const fullMessage = `${user} the rat says: ${message}`;
        messageElement.textContent = fullMessage;
        chatMessages.appendChild(messageElement);
        console.log(fullMessage);
    }

    sendButton.addEventListener('click', () => {
        if (chatInput.value.trim() !== '') {
            const message = chatInput.value.trim();
            socket.emit('chatMessage', message);
            chatInput.value = '';
        }
    });

    socket.on('chatMessage', (data) => {
        const { user, message } = data;
        addMessage(user, message);
    });
});
