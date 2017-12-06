const WebSocket=require('ws');
const dQueries=require('./db.rooms.js');
const UTILS=require('./utils.js');

exports.initServer = (server, dbCon) => {
  const dbActionsToIgnore=['emptyRoom','newClient','lapsedClient','freeze','moving'];
  const Db=dQueries(dbCon);
  let clientID=0;
  let clients={}; //map of clientID to WS Client Object
  let rooms={}; //map of roomID to an array of clientIDs joined to room

  const sendPrivateMessage = (msg, recClient) => {
    let C=clients[recClient].obj;
    if (C) { C.sendMsg(msg); }
    else { return false; }
  };

  let wss=new WebSocket.Server({server: server});
  wss.broadcast = function broadcast(data, room, sendingClient) {
    rooms[room].forEach(function(clientID) {
      if (clientID!==sendingClient) {
        let client=clients[clientID].obj;
        if (client&&client.readyState===client.OPEN) { client.sendMsg(data); }
        else { //client ID is stale, remove from rooms
          rooms[room] = remove(rooms[room],clientID);
        }
      }
    });
  };

  function heartbeat() { this.isAlive = true; }
  const interval = setInterval(function ping() {
    Object.keys(clients).forEach(function each(clientID) {
      let client = clients[clientID];
      let cObj=client.obj;
      if (cObj.isAlive === false) { terminateClient(client); }
      cObj.isAlive=false;
      cObj.ping('', false, true);
      });
    }, UTILS.$.wsPingInterval);

  function terminateClient(client) {
    let cObj=client.obj;
    let CUID=client.id;
    cObj.terminate();
    let R=cObj._CURRENT_ROOM;
    if (R && rooms[R]) { rooms[R]=UTILS.remove(rooms[R],CUID); }
    wss.broadcast({action:'talkToRoom', data:'Goodbye, client '+CUID+'!'},R,CUID);
    delete clients[CUID];
  }

  wss.on('connection', function connection(client) {
    client.isAlive = true;
    client.on('pong', heartbeat.bind(client));
    clientID++;
    let CUID=clientID;
    clients[CUID]={obj: client, id:clientID};
    if (client.readyState===client.OPEN) {
      client.sendMsg = function(message) { //Server Message Bus
        let payload=JSON.stringify(message);
        client.send(payload);
      };
      client.on('message', function incoming(message) {
        if (!message) { return false; }
        message=JSON.parse(message);
        if (client._CURRENT_ROOM&&message.data) {
          let R=client._CURRENT_ROOM;
          rooms[R]=UTILS.promote(rooms[R], CUID);
        }
        if (!dbActionsToIgnore.includes(message.action)) {
          //Database hook: can save state to db here
        }
        switch(message.action) {
          case 'newClient':
            let R=message.room;
            client._CURRENT_ROOM=R;
            rooms[R] = rooms[R] ? rooms[R].concat(CUID) : [CUID];
            wss.broadcast({action:'talkToRoom', data:'Welcome, client '+CUID+'!'},message.room,CUID);
            break;
          case 'echo': sendPrivateMessage(message, CUID); break;
          case 'talkToRoom': wss.broadcast(message,message.room,CUID); break;
          default: wss.broadcast(message,message.room,CUID); break;
        }
      });
    }
    client.on('close', function close() { terminateClient(clients[CUID]); });
  });
};
