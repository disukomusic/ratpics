const socket = io('https://quality-mint-snapper.ngrok-free.app');
const userDisplayNames = {};

document.addEventListener('DOMContentLoaded', () => {
    const ratImage = new Image();
    ratImage.src = 'rat1.png'; // Path to your rat image

    const displayName = localStorage.getItem('displayName'); // Retrieve display name from local storage

    if (displayName) {
        userDisplayNames[socket.id] = displayName;
        socket.emit('setDisplayName', displayName);
    }

    socket.on('userMouseMove', (data) => {
        const { clientId, x, y } = data;
        let ratPointer = document.getElementById(clientId);

        if (!ratPointer) {
            ratPointer = document.createElement('img');
            ratPointer.id = clientId;
            ratPointer.src = ratImage.src;
            ratPointer.classList.add('rat-pointer');
            document.body.appendChild(ratPointer);
        }

        ratPointer.style.left = `${x}px`;
        ratPointer.style.top = `${y}px`;
    });

    socket.on('userDisconnected', (clientId) => {
        const ratPointer = document.getElementById(clientId);
        if (ratPointer) {
            ratPointer.remove();
        }
    });

    socket.on('updateUserList', (userList) => {
        const userListElement = document.getElementById('user-list');
        userListElement.innerHTML = '';

        userList.forEach((user) => {
            const userItem = document.createElement('li');
            userItem.textContent = user;
            userListElement.appendChild(userItem);
        });
    });

    document.addEventListener('mousemove', (event) => {
        const { clientX, clientY } = event;
        socket.emit('mouseMove', { x: clientX, y: clientY });
    });
});
