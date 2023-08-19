const socket = io('https://quality-mint-snapper.ngrok-free.app', {
    transports: ['websocket']
});
const userDisplayNames = {};

document.addEventListener('DOMContentLoaded', () => {
    const displayName = localStorage.getItem('displayName');
    const welcomeMessage = `welcome to the rat hangout! ioh boY! i lvoe rats!`;
    socket.emit('chatMessage', welcomeMessage);

    if (!displayName) {
        const userInput = prompt('RAT NAME RAT NAME (you can only choose one rat name and it is yours forver)');
        if (userInput) {
            localStorage.setItem('displayName', userInput);
            userDisplayNames[socket.id] = userInput;
            socket.emit('setDisplayName', userInput);

            const welcomeMessage = `welcome to the rat chat, ${userInput}!!! ioh boY! i lvoe rats!`;
            socket.emit('chatMessage', welcomeMessage);
        }
    } else {
        userDisplayNames[socket.id] = displayName;
        socket.emit('setDisplayName', displayName); // Place it here
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
	
	    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
			event.preventDefault();
            if (chatInput.value.trim() !== '') {
            const message = chatInput.value.trim();
            socket.emit('chatMessage', message);
            chatInput.value = '';
        }// Call the sendMessage function
        }
    });

socket.on('chatMessage', (data) => {
    const { user, message } = data;
    if (user === 'anon rat' && userDisplayNames[socket.id]) {
        addMessage(userDisplayNames[socket.id], message);
    } else {
        addMessage(user, message);
    }
});

socket.on('userDisconnectMessage', (disconnectedUserDisplayName) => {
    addMessage('RAT SYSTEM', `${disconnectedUserDisplayName} has been rat smited!! he is dead forevery!!11`);
});


});
