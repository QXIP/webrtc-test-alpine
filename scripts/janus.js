function start() {
  try {
    console.log('trying to join...');
    const startButton = document.getElementById('start');
    if (!startButton) {
        return setTimeout(start, 1000);
    }
    console.log(`Starting the room`);
    // join the room
    startButton.click();
    setTimeout(join, 2000);
  } catch(e) { console.error(e); }
}

function join() {
  try {
    console.log('trying to join...');
    const userName = document.getElementById('username');
    const joinButton = document.getElementById('register');
    if (!joinButton) {
        return setTimeout(join, 1000);
    }
    console.log(`Joining the room`);
    // join the room
    userName.value = "stresstest";
    joinButton.click();
  } catch(e) { console.error(e); }
}

console.log('injecting...');
setTimeout(start, 2000);
