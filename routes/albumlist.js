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
router.get('/:type', function(req, res, next) {
  var type = req.params.type,
      max  = req.query.max,
      min  = req.query.min;

  music.collection('albums').find({"type":type}).limit(12).toArray(function(err,data) {
    res.json({data:data});
  });
});

router.post('/:type', function(req, res, next) {
  var type    = req.params.type,
      max     = req.body.max,
      min     = req.body.min,
      search  = req.body.search;

  music.collection('albums').find({"type":type}).toArray(function(err,data) {

    var _data             = [],
        _dataLength       = 0,
        _dataTotalLength  = data.length,
        _finalStatus      = false;

    if( search!='' && search!=undefined ){
      _data = [];
      min   = 0;
      max   = 12;
      for(var d=0 ; d<data.length ; d++){
        if( data[d].music_name_cn.search(search)!=-1 ){
          _data = _data.concat(data[d]);
        }
      }
    }else{
      for(var i=min ; i<max ; i++){
        if( i<_dataTotalLength ){
          _data = _data.concat(data[i]);
        }
      }
    }

    _dataLength = _data.length;
    if( _dataLength%(max-min)!=0 ){
      _finalStatus = true;
    }

    res.json({data:_data,finalStatus:_finalStatus});
  });
});

router.get('/list/:albumId', function(req, res, next) {
  var albumId    = req.params.albumId;

  music.collection('songs').find({ "albums_id":albumId }).toArray(function(err,data) {
    res.json({data:data});
  });
});

module.exports = router;
