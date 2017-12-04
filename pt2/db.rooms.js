module.exports = function(dbCon) {
  if (!dbCon) { throw new Error('Module must be injected with an active database connection.'); }
  return {
    saveRoom: function (D, cb) {
      dbCon.collection("rooms").update(
        {room:D.room},
          {$inc: {visits: 1},
           $set: {room:D.room, data:D.data, lastUpdate: new Date()}
          },
        {upsert:true}, function(err, data) { console.log(data.result); return cb(err, data); });
      },
    loadRoom: function (name, cb) {
      dbCon.collection("rooms").find({room:name}).toArray(function(err,data){
        return cb(err, data);
      });
    }
  };
};
