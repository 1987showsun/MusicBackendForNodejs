var guessbase_url   = 'mongodb://127.0.0.1:27017/music';
var express         = require('express');
var ObjectId        = require('mongodb');
var MongoClient     = require('mongodb').MongoClient;
var ObjectId        = require('mongodb').ObjectID;
var jwt             = require('jsonwebtoken');

var router          = express.Router();
MongoClient.connect( guessbase_url , function(err, data){
  music = data;
});

/* GET home page. */
router.get('/signIn', function(req, res, next) {
  var _params   = JSON.parse(req.query.data)
      username  = _params.username,
      password  = _params.password;
  if(username==''){
    res.json({
      success : false,
      message : '請輸入帳號'
    });
  }else if( password=='' ){
    res.json({
      success : false,
      message : '請輸入密碼'
    });
  }else{
    music.collection('member').find({"username" : username , "password" : password }).toArray(function(err,data) {
      if( data.length!=0 ){
        var _data = {};
        var token = jwt.sign(_data,'aaaa')//process.env.SECRET_KEY
        res.json({
          success : true,
          token   : token
        });
        music.collection('member').update({_id : ObjectId(data[0]._id)},{$set:{"token":token}});
      }else{
        res.json({
          success : false,
          message : '帳號密碼錯誤，請重新輸入'
        });
      }
    });
  }
});

router.get('/signOut', function(req, res, next) {
})

router.get('/signIn/protected', ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('member').find({"token" : req.token }).toArray(function(err,data) {
        res.json({
          data : data
        });
      });
    }
  });
});

router.get('/signIn/collection/:theme', ensureToken, function(req, res, next) {

  var theme       = req.params.theme,
      memberId    = req.query.memberId,
      selectId    = req.query.selectId,
      totalData   = [],
      status      = false;

  var themeArray = {
      "albumCollection" : "albums",
      "songsCollection" : "songs",
      "playRecord"      : "songs"
  },
  selectCollection = themeArray[theme];

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {

      music.collection('memberRecord').find({ member_id : memberId }).toArray(function(err,collectionData) {
        var collectionIdArray = collectionData[0][theme];

        collectionIdArray.map(function(item,i){
          if( item==selectId ){
            collectionIdArray.splice(i,1);
            status = true;
          }
        })

        if( !status ){
          collectionIdArray.push(selectId);
        }

        //回存紀錄
        music.collection('memberRecord').update({_id : ObjectId( collectionData[0]._id )},{$set:{ [theme]: collectionIdArray  }});

        //記錄比對回傳
        music.collection('albums').find().toArray(function(err,data) {
          for(var i=0 ; i<collectionIdArray.length ; i++){
            for(var q=0 ; q<data.length ; q++){
              if( collectionIdArray[i]==data[q]._id ){
                totalData.push( data[q] );
              }
            }
          }
          res.json({
            data : totalData
          });
        });
      });
    }
  });
});

router.get('/signIn/:theme', ensureToken, function(req, res, next) {

  var theme = req.params.theme,
      _id   = req.query.id;

  var themeArray = {
      "albumCollection" : "albums",
      "songsCollection" : "songs",
      "playRecord"      : "songs"
  },
  selectCollection = themeArray[theme];

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {

      music.collection('memberRecord').find({ member_id : _id }).toArray(function(err,collectionData) {
        var collectionIdArray = collectionData[0][theme];
        music.collection( selectCollection ).find().toArray(function(err,data) {
          var dataArray = [];

          data.map(function(item1,data_i){
            collectionIdArray.map(function(item2,collectionIdArray_i){
              if(item1._id==item2){
                dataArray.push(item1)
              }
            });
          })
          res.json({
            data : dataArray
          });
        });
      });
    }
  });
});

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
