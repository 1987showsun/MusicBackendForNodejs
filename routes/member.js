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
        var token = jwt.sign(_data,'aaaa')
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

router.get('/signIn/put/collection/:theme', ensureToken, function(req, res, next) {

  var theme       = req.params.theme,
      memberId    = req.query.memberId,
      selectId    = req.query.selectId,
      totalData   = [],
      status      = false;

  var themeArray = {
      "albumCollection" : "albums",
      "songsCollection" : "songs",
      "playRecord"      : "songs",
      "playList"        : "songs"
  },
  selectCollection = themeArray[theme];

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('memberRecord').find({ member_id : ObjectId(memberId) }).toArray(function(err,collectionData) {
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
        music.collection(selectCollection).find().toArray(function(err,data) {
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

router.get('/signIn/get/collection/:theme', ensureToken, function(req, res, next) {

  var theme = req.params.theme,
      _id   = req.query.id;

  var themeArray = {
      "albumCollection" : "albums",
      "songsCollection" : "songs",
      "playRecord"      : "songs",
      "playList"        : "songs"
  },
  selectCollection = themeArray[theme];

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('memberRecord').find({ member_id : ObjectId(_id) }).toArray(function(err,collectionData) {
        var collectionIdArray = collectionData[0][theme] || [];
        if( theme=='playList' ){
          res.json({
            addStatus : false,
            data      : collectionIdArray
          });
        }else{
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
        }
      });
    }
  });
});

router.get('/join', function(req, res, next) {
  var data              = JSON.parse(req.query.data),
      memberDataLength  = 0,
      addSwitch         = true,
      username          = '',
      password          = '',
      id                = '',
      token             = '';

  music.collection('member').find().toArray(function(err,memberData) {

    username          = data.username;
    password          = data.password;
    memberDataLength  = memberData.length;

    for(var i=0 ; i<memberDataLength ; i++){
      if( memberData[i].username==data.username ){
        addSwitch = false;
      }
    }

    //登入成功
    if( addSwitch ){

      music.collection('member').insert(data,function(err, afterData){
        id      = afterData.ops[0]._id;
        token   = jwt.sign({},'aaaa');
        music.collection('member').update({_id : ObjectId(id)},{$set:{"token":token}});
        music.collection('memberRecord').insert({
          "member_id"       : id,
          "albumCollection" : [],
          "songsCollection" : [],
          "playRecord"      : [],
          "playList"        : [],
        })

        res.json({
          success : true,
          token   : token
        });
      });
    }else{
      res.json({
        success : false,
        token   : ''
      });
    }
  });
});

router.get('/share/join', function(req, res, next) {
  var profile   = JSON.parse(req.query.data),
      username  = profile.username,
      id        = '',
      token     = '';

  music.collection('member').find({"username" : username }).toArray(function(err,data){
    if( data.length==0 ){
      music.collection('member').insert(profile,function(err, afterData){
        id     = afterData.ops[0]._id;
        token  = jwt.sign({},'aaaa');
        music.collection('member').update({_id : ObjectId(id)},{$set:{"token":token}});
        music.collection('memberRecord').insert({
          "member_id"       : id,
          "albumCollection" : [],
          "songsCollection" : [],
          "playRecord"      : [],
          "playList"        : [],
        });

        res.json({
          success : true,
          token   : token
        });
      });
    }else{
      var token  = jwt.sign({},'aaaa');
      music.collection('member').update({_id : ObjectId(data[0]._id)},{$set:{"token":token}});
      res.json({
        success : true,
        token   : token
      });
    }
  })
});


router.get('/get/playlistsortlist', ensureToken, function(req, res, next) {
  var id       = req.query.id,
      sort     = req.query.sort,
      songs    = [],
      allSongs = [];

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('memberRecord').find({member_id:ObjectId(id)}).toArray(function(err,playlistData){
        var data          = playlistData[0]['playList'];
        if(sort!=''){
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
        }else{
          res.json({
            data      : data,
            songs     : [],
          });
        }
      });
    }
  })
});

router.delete('/remove/playlistsort', ensureToken, function(req, res, next) {
  var id   = req.query.id,
      sort = req.query.sort;

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('memberRecord').find({member_id:ObjectId(id)}).toArray(function(err,playlistData){
        var data   = playlistData[0]['playList'];
        if( data.length>0 ){
          data.map(function(item,i){
            if(item.name==sort){
              data.splice(i,1);
              music.collection('memberRecord').update({member_id:ObjectId(id)},{$set:{playList : data}});
              res.json({
                data      : data,
              });
            }
          })
        }
      });
    }
  })
});

router.delete('/remove/playlistsongs', ensureToken, function(req, res, next) {
  var id      = req.query.id,
      sort    = req.query.sort,
      songsId = req.query.songsId,
      songs   = [];

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('memberRecord').find({member_id:ObjectId(id)}).toArray(function(err,playlistData){
        var data   = playlistData[0]['playList'];
        if( data.length>0 ){
          data.map(function(item1,i){
            if(item1.name==sort){
              var list = item1.list;
              list.map(function(item2,s){
                if(item2==songsId){
                  list.splice(s,1);
                }
              })
              data[i]['list'] = list;
              music.collection('memberRecord').update({member_id:ObjectId(id)},{$set:{playList : data}});
              if( list.length>0 ){
                music.collection('songs').find({}).toArray(function(err,songsData){
                  list.map(function(item,i){
                    songsData.map(function(song,s){
                      if( item==song._id ){
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
                });
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

router.delete('/remove/selectplaylistsongs', ensureToken, function(req, res, next) {
  var id      = req.query.id,
      sort    = req.query.sort,
      songsId = req.query.songsId,
      songs   = [];

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('memberRecord').find({member_id:ObjectId(id)}).toArray(function(err,playlistData){
        var data   = playlistData[0]['playList'];
        if( data.length>0 ){
          data.map(function(item,i){
            if(item.name==sort){
              var list = item.list;
              list.map(function(item,s){
                if(item==songsId){
                  list.splice(s,1);
                }
              })
              data[i]['list'] = list;
              music.collection('memberRecord').update({member_id:ObjectId(id)},{$set:{playList : data}});
              res.json({
                data      : data,
              })
            }
          })
        }
      });
    }
  })
});

router.post('/post/selectplaylistsongs', function(req, res, next) {
  var id      = req.body.id,
      sort    = req.body.sort,
      songsId = req.body.songsId,
      songs   = [];
      music.collection('memberRecord').find({member_id:ObjectId(id)}).toArray(function(err,playlistData){
        var data                  = playlistData[0]['playList'],
            checkRepeatKeysSwitch = true;

        data.map(function(item,i){
          if( item.name==sort ){
            data[i].list.push(songsId);
            music.collection('memberRecord').update({member_id:ObjectId(id)},{$set:{playList : data}});
            res.json({
              data      : data,
            })
          }
        })
      });
});

router.get('/post/addplaylistsort', ensureToken, function(req, res, next) {
  var sort = req.query.sort,
      id   = req.query.id;

  jwt.verify(req.token, 'aaaa', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      music.collection('memberRecord').find({member_id:ObjectId(id)}).toArray(function(err,playlistData){
        var data          = playlistData[0]['playList'],
            checkRepeatKeysSwitch = true;

        if(data.length==0){
          data.push({"name":sort,"list":[]})
          music.collection('memberRecord').update({member_id:ObjectId(id)},{$set:{playList : data}});
          res.json({
            data      : data,
          });
        }else{
          data.map(function(item,i){
            if( item.name == sort ){
              checkRepeatKeysSwitch = false;
            }

            if(i==data.length-1){
              if(checkRepeatKeysSwitch){
                data.push({"name":sort,"list":[]})
                music.collection('memberRecord').update({member_id:ObjectId(id)},{$set:{playList : data}});
                res.json({
                  data      : data,
                });
              }else{
                res.json({
                  data      : data,
                });
              }
            }
          })
        }
      })
    }
  });
})

router.put('/put/editplaylistsort/:id/:beforeName/:afterName', function(req, res, next) {
  var afterName   = req.params.afterName,
      id          = req.params.id,
      beforeName  = req.params.beforeName;

  music.collection('memberRecord').find({member_id:ObjectId(id)}).toArray(function(err,playlistData){
    var data      = playlistData[0]['playList'],
        checkRepeatKeysSwitch = true;

    data.map(function(item,i){
      if( item.name==beforeName ){
        data[i]['name'] = afterName;
        music.collection('memberRecord').update({member_id:ObjectId(id)},{$set:{playList : data}});
        res.json({
          data      : data,
        });
      }
    });
  })
})

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
