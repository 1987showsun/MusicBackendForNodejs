var guessbase_url   = 'mongodb://127.0.0.1:27017/music';
var express         = require('express');
var ObjectId        = require('mongodb');
var MongoClient     = require('mongodb').MongoClient;
var ObjectId        = require('mongodb').ObjectID;

var router          = express.Router();
MongoClient.connect( guessbase_url , function(err, data){
  music = data;
});

/* 區域 */
router.get('/area', function(req, res, next) {
  music.collection('area').find({}).toArray(function(err,areaData) {
    res.json({
      data : areaData
    })
  });
});

router.get('/:area', function(req, res, next) {
  var area       = req.params.area;

  music.collection('artists').find({area:area}).toArray(function(err,areaData) {
    res.json({
      data : areaData
    })
  });
});

router.get('/:area/:id', function(req, res, next) {
  var area       = req.params.area,
      id         = req.params.id;

  music.collection('artists').find({_id:ObjectId(id),area:area}).toArray(function(err,selectData) {
    selectData[0].count = selectData[0].count+1;
    music.collection('artists').update({_id:ObjectId(id)},{$set:{"count":selectData[0].count}});
    music.collection('albums').find({artists_id:id}).toArray(function(err,albumsData) {
      res.json({
        data    : selectData,
        albums  : albumsData,
      })
    });
  });
});

module.exports = router;
