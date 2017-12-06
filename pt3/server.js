const express=require('express');
const path=require('path');
const http=require('http');
const WebSocket=require('ws');

const Db=require('./db.js');
const rooms=require('./db.rooms.js');
const Ws=require('./ws.js');

const app=express();
const appPORT=process.env.PORT || 8080;
const server=http.createServer(app);

app.use('/static',express.static(path.join(__dirname,'/static')));

Db.connect((err,db)=>{
  if (err) {
    console.error('Failed to make all database connections!');
    console.error(err);
    process.exit(1);
  }
  Ws.initServer(server, db);
});

app.get('/:p', (req, res) => {
  if (req.params.p.match(/[^a-z0-9-]/gi)) { return false; }
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/*', (req, res) => res.sendFile(path.join(__dirname+'/usage.html')));

server.listen(appPORT);
