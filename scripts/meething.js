function join() {
  try {
    console.log('trying to join...');
    const joinButton = document.getElementById('randomGo');
    if (!joinButton) {
        return setTimeout(join, 1000);
    }
    console.log(`Joining the room`);
    // join the room
    joinButton.click();
  } catch(e) { console.error(e); }
}
console.log('injecting...');
setTimeout(join, 2000);
