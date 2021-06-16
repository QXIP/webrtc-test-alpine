function join() {
  try {
    console.log('trying to join...');
    const joinButton = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('limited'))
    if (!joinButton) {
        console.log('waiting...'
        return setTimeout(join, 2000);
    }
    console.log(`Joining the room`);
    // join the room
    joinButton.click();
    setTimeout(login, 1000);
  } catch(e) { console.error(e); }
}
console.log('injecting...');
setTimeout(join, 2000);


function login(){
  try {
    var username = document.getElementById('attendeeName');
    var login = document.getElementById('join');
    if (!username || !login) {
        console.log('waiting...'
        return setTimeout(login, 2000);
    }
    console.log('entering!');
    username.value = 'tester'
    login.click();
  } catch(e) { console.error(e); }
}

}
