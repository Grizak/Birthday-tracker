const socket = io('http://localhost:3000');

socket.on('newBirthday', (birthday) => {
    console.log('New birthday added:', birthday);
    // Update the UI with the new birthday
});
