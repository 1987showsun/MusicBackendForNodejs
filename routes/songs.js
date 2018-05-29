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
router.get('/allplay/', ensureToken, function(req, res, next) {
  var albums_id       = req.query.albums_id,
      playlistArray   = [];

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('songs').find({albums_id : albums_id}).toArray(function(err,songsData) {
        music.collection('albums').find({ _id : ObjectId(albums_id) }).toArray(function(err,albumData) {
          songsData.map(function(item,i){
            item['albumsImg'] = albumData[0].albumsImg;
          })
          res.json({data:songsData});
        })
      });
    }
  });
});

router.get('/songsPutCount/:id', function(req, res, next) {
  var id = req.params.id;
  music.collection('songs').find({_id : ObjectId(id)}).toArray(function(err,songsData) {
    songsData[0].count = songsData[0].count+1;
    music.collection('songs').update({_id: ObjectId(id)},{$set:{"count":songsData[0].count}},function(){
      res.json({
        success : true
      })
    });
  })
});

router.get('/:id', ensureToken, function(req, res, next) {
  var id = req.params.id,
      max  = req.query.max,
      min  = req.query.min;

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('songs').find({_id : ObjectId(id) }).toArray(function(err,songsData) {
        var songsObject = songsData;
            albums_id   = songsObject[0].albums_id;
        music.collection('albums').find({ _id : ObjectId(albums_id) }).toArray(function(err,albumData) {
          songsObject[0]['albumsImg'] = albumData[0].albumsImg;
          res.json({data:songsObject});
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
