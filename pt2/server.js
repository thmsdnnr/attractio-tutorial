const express=require('express');
const path=require('path');
const http=require('http');

const Db=require('./db.js');
const rooms=require('./db.rooms.js');
let dbQueries=null;

const app=express();
const appPORT=process.env.PORT || 8080;
const server=http.createServer(app);

app.use('/static',express.static(path.join(__dirname,'/static')));

Db.connect((err, db)=>{
  try { dbQueries=rooms(db) }
  catch(err) {
    console.error('Failed to connect to database!', err);
    process.exit(1);
  }
});

app.post('/:p', (req, res) => {
  if (req.params.p.match(/[^a-z0-9-]/gi)) { return false; }
  else {
    dbQueries.loadRoom(req.params.p, function(error,data) {
      if (!error) { res.json({room:req.params.p, visits:data[0].visits}); }
      else { res.json({err:error}); }
    });
  }
});

app.get('/:p', (req, res) => {
  if (req.params.p.match(/[^a-z0-9-]/gi)) { return false; }
  else {
    dbQueries.saveRoom({room:req.params.p, data:new Date()}, function(error, data) {
      if (!error) { res.sendFile(path.join(__dirname+'/index.html')); }
      else { res.json({err:error}); }
    });
  }
});

app.get('/*', (req, res) => res.sendFile(path.join(__dirname+'/usage.html')));

server.listen(appPORT);
