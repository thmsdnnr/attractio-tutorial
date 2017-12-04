const express=require('express');
const path=require('path');
const http=require('http');
const app=express();
const appPORT=process.env.PORT || 8080;
const server=http.createServer(app);

app.use('/static',express.static(path.join(__dirname,'/static')));

app.get('/:p', (req,res) => {
  if (req.params.p.match(/[^a-z0-9-]/gi)) { return false; }
  else { res.sendFile(path.join(__dirname+'/index.html')); }
});

app.get('/*', (req, res) => res.sendFile(path.join(__dirname+'/usage.html')));

server.listen(appPORT);
