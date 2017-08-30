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
router.get('/:id', function(req, res, next) {

  var id = req.params.id,
      max  = req.query.max,
      min  = req.query.min;

  music.collection('songs').find({_id : ObjectId(id) }).limit(18).toArray(function(err,data) {
    res.json({data:data});
  });
});

module.exports = router;
