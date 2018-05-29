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

router.get('/t', function(req, res, next) {
  res.render('t', { title: 'Express' });
});

router.get('/index', function(req, res, next) {
  var test = ['Chinese','Western','Japanese','Korean'],
      shareText = '';
  music.collection('kv').find({}).toArray(function(err,kvData) {
    music.collection('albums').find({status:"new"}).sort({"publish_time":-1}).limit(12).toArray(function(err,theLatestAlbumData) {
      music.collection('albums').find({type:test[0]}).sort({"count":-1}).limit(6).toArray(function(err,chinesehitoData) {
        music.collection('albums').find({type:test[1]}).sort({"count":-1}).limit(6).toArray(function(err,westernhitoData) {
          music.collection('albums').find({type:test[2]}).sort({"count":-1}).limit(6).toArray(function(err,japanesehitoData) {
            music.collection('albums').find({type:test[3]}).sort({"count":-1}).limit(6).toArray(function(err,koreanhitoData) {
              music.collection('artists').find({}).sort({"count":-1}).limit(12).toArray(function(err,artistsData) {
                res.json({
                  kvData          : kvData,
                  theLatestAlbum  : theLatestAlbumData,
                  chinesehito     : chinesehitoData,
                  westernhito     : westernhitoData,
                  japanesehito    : japanesehitoData,
                  koreanhito      : koreanhitoData,
                  artistshito     : artistsData
                });
              });
            });
          });
        });
      });
    });
  });
});

router.get('/kv', function(req, res, next) {
  music.collection('kv').find({}).toArray(function(err,data) {
    res.json({data:data});
  });
});

router.get('/ranking', function(req, res, next) {
  music.collection('albums').find({}).sort({"count":-1}).limit(12).toArray(function(err,data) {
    res.json({data:data});
  });
});

router.get('/area', function(req, res, next) {
  music.collection('area').find({}).toArray(function(err,areaData) {
    res.json({
      data : areaData
    })
  });
});

router.get('/top100Songs/:area', function(req, res, next) {
  var area = req.params.area;

  music.collection('songs').find({type:area}).sort({"count":-1}).limit(100).toArray(function(err,songaData) {
    res.json({
      songaData : songaData
    })
  });
});

router.get('/mv/all/:albumId', function(req, res, next) {
  var albumId = req.params.albumId;
  music.collection('youtube').find({albums_id:albumId}).toArray(function(err,mvAllData) {
    res.json({
      data : mvAllData
    })
  });
});

router.get('/mv/:videoId', function(req, res, next) {
  var videoId = req.params.videoId;
  music.collection('youtube').find({_id : ObjectId(videoId)}).toArray(function(err,mvData) {
    res.json({
      data : mvData
    })
  });
});

router.get('/playlistsortsongs', ensureToken, function(req, res, next) {
  var id   = req.query.id,
      sort = req.query.sort,
      songs= [],
      allSongs = [];

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('memberRecord').find({member_id:ObjectId(id)}).toArray(function(err,playlistData){
        var data          = playlistData[0]['playList'];
        if( data.length>0 ){
          data.map(function(item1,i){
            if( sort==item1.name ){
              var list = item1.list;
              if( list.length>0 ){
                music.collection('songs').find({}).toArray(function(err,songsData){
                  list.map(function(item2,i){
                    songsData.map(function(song,s){
                      if( item2==song._id ){
                        songs.push(song);
                        if( i==list.length-1 ){
                          res.json({
                            data      : data,
                            songs     : songs,
                          });
                        }
                      }
                    })
                  })
                })
              }else{
                res.json({
                  data      : data,
                  songs     : [],
                });
              }
            }
          })
        }
      });
    }
  })
});

router.get('/lyrics', ensureToken, function(req, res, next) {
  var songsId   = req.query.songsId;

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('lyrics').find({songs_id:songsId}).toArray(function(err,lyricsData){
        res.json({
          data : lyricsData
        })
      });
    }
  })
});

router.get('/getAllMemberName', function(req, res, next) {
  var username = []
  music.collection('member').find({}).toArray(function(err,member){
    member.map(function(item,i){
      username.push(item.username);
    })
    res.json({
      username : username,
    })
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
