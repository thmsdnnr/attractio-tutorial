var MongoClient = require('mongodb').MongoClient;
let db;
let dbUrl=process.env.PROD_DB||'mongodb://localhost:27017/';

exports.connect = function(callback) {
  if (db===undefined) {
    MongoClient.connect(dbUrl, function(err, database){
      if(err) { return callback(err, null) };
      db=database;
      callback(null, db);
    });
  } else { callback(null, db); }
}
