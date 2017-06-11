var guessbase_url   = 'mongodb://127.0.0.1:27017/music';
var express         = require('express');
var ObjectId        = require('mongodb');
var MongoClient     = require('mongodb').MongoClient;
var ObjectId        = require('mongodb').ObjectID;
var router          = express.Router();
MongoClient.connect( guessbase_url , function(err, data){
  music = data;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/kv', function(req, res, next) {
  music.collection('kv').find({}).toArray(function(err,data) {
    res.json({data:data});
  });
});

router.get('/vicebanner', function(req, res, next) {
  music.collection('vicebanner').find({}).toArray(function(err,data) {
    res.json({data:data});
  });
});

router.get('/artists', function(req, res, next) {
  music.collection('artists').find({}).sort({"count":-1}).limit(12).toArray(function(err,data) {
    res.json({data:data});
  });
});

router.get('/albumtype', function(req, res, next) {
  music.collection('albumType').find({}).toArray(function(err,data) {
    res.json({data:data});
  });
});

router.get('/mv', function(req, res, next) {
  music.collection('youtube').find({}).sort({"count":-1}).limit(12).toArray(function(err,data) {
    res.json({data:data});
  });
});

module.exports = router;
