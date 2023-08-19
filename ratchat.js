const socket = io('https://quality-mint-snapper.ngrok-free.app', {
    transports: ['websocket']
});
const userDisplayNames = {};

document.addEventListener('DOMContentLoaded', () => {
    const displayName = localStorage.getItem('displayName');

    if (!displayName) {
        const userInput = prompt('RAT NAME RAT NAME (you can only choose one rat name and it is yours forver, /nick to change)');
        if (userInput) {
            localStorage.setItem('displayName', userInput);
            userDisplayNames[socket.id] = userInput;
            socket.emit('setDisplayName', userInput);

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
        const fullMessage = `<${user}>  ${message}`;
		messageElement.innerHTML = fullMessage;
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

        const message = chatInput.value.trim();

        if (message.startsWith('/nick ')) {
            const newDisplayName = message.slice(6).trim();
            if (newDisplayName) {
                localStorage.setItem('displayName', newDisplayName);
                userDisplayNames[socket.id] = newDisplayName;
                socket.emit('setDisplayName', newDisplayName);
            }
        } else if (message !== '') {
            socket.emit('chatMessage', message);
        }

        chatInput.value = '';
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
