function join() {
    const joinButton = document.getElementById('randomGo');
    if (!joinButton) {
        return setTimeout(join, 1000);
    }
    console.log(`Joining the room`);
    // join the room
    joinButton.click();
}
join();
