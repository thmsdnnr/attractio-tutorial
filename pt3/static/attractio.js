let G={};

window.onload = function() {
  sockets();
  setInterval(function echoPlex() {
    let currentTime=new Date(Date.now())
    G.sendMsg({action:'echo', data: currentTime});
  },4000);
};

function beforeUnload() {
  G.sendMsg({action:'talkToRoom', data:'Goodbye!'});
  G.socket.close();
}

function sockets() {
    let messageList=document.querySelector('ul#messages');
    window.addEventListener('beforeunload', beforeUnload);
    var host = window.location.origin.replace(/^http/, 'ws');
    G.socket = new WebSocket(host);
    G.room=window.location.href.split("/");
    G.room=G.room[G.room.length-1];
    G.sendMsg = function(msg) { //socket message wrapper
      if (G.socket.readyState===G.socket.OPEN) {
        let alwaysSendData={room:G.room, pieceB:'I will always get sent!'};
        let payload=JSON.stringify(Object.assign(msg, alwaysSendData));
        G.socket.send(payload);
      }
      else { //need to recover connection
        if (G.reconnectAttempts<5) { G.socket = new WebSocket(host); }
        G.reconnectAttempts++;
      }
    };
    G.socket.addEventListener('open', (event) => {
      G.sendMsg({action:'newClient'});
    });
    G.socket.addEventListener('message', (event) => {
      event=JSON.parse(event.data);
      let newItem=document.createElement('li');
      switch(event.action) {
        case 'echo':
          newItem.innerHTML='Echo timestamp: '+event.data;
          messageList.prepend(newItem);
        break;
        case 'talkToRoom':
          newItem.innerHTML='Message broadcast: '+event.data;
          messageList.prepend(newItem);
        break;
        default: console.log('Message received', event); break;
      }
    });
  }
