//express 設定
var express = require('express');
var app = express();
var bodyParser = require('body-parser').json();

//sqlLite 宣告
var file = "tripmoment.db";
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

//設定跨域請求
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header('Connection','keep-alive')
    next(); 
});
db.run('CREATE TABLE IF NOT EXISTS Message (id INTEGER PRIMARY KEY ,videoId,message,time)')

app.post('/sendMessage', bodyParser, function(req, res) {
  var videoId = req.body.videoId;
  var message = req.body.message;
  var getDate = new Date();
  var nowdate = (getDate.getFullYear()) + '-' + ("0" + (getDate.getMonth() + 1)).slice(-2) + '-' + ("0" + getDate.getDate()).slice(-2);
  console.log('INSERT INTO Message VALUES (?,?,?,?)',[
    null,
    videoId,
    message,
    nowdate
  ]);
  db.run('INSERT INTO Message VALUES (?,?,?,?)',[
    null,
    videoId,
    message,
    nowdate
  ]);
  console.log(req.body);
  res.status(200).send({status:'success'});
});

app.get('/getMessage',function(req,res){
  var returnData = {data:[]};
  var videoId = req.query.videoId;
  var GetMessagePromise = new Promise(function(reject,result){
      db.all(`SELECT * FROM Message WHERE videoId='${videoId}'`,function(err,row){
          returnData.data = row;
          reject();
      });
  });

  Promise.all([GetMessagePromise]).then(function(){
      returnData.status = 'success'
      res.status(200).send(returnData);
  })
});

//宣告Port號
app.listen(5050);
console.log('Listening on port 5050...');