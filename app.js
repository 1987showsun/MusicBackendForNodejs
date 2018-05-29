var url               = 'mongodb://127.0.0.1:27017/music';
var express           = require('express');
var http              = require("http");
var MongoClient       = require('mongodb').MongoClient;
var ObjectId          = require('mongodb').ObjectID;
var path              = require('path');
var favicon           = require('serve-favicon');
var logger            = require('morgan');
var cookieParser      = require('cookie-parser');
var bodyParser        = require('body-parser');
var sassMiddleware    = require('node-sass-middleware');
var fs                = require("fs");
var jwt               = require('jsonwebtoken');
var index             = require('./routes/index');
var albumlist         = require('./routes/albumlist');
var songs             = require('./routes/songs');
var users             = require('./routes/users');
var member            = require('./routes/member');
var artists           = require('./routes/artists');
var api               = require('./routes/api');

var app               = express();
var server            = require('http').Server(app);
var io                = require('socket.io')(server);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);
    else  next();
});

process.env.SECRET_KEY = "tokenkey";
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.disable('x-powered-by');

app.use(sassMiddleware({
  src  : path.join(__dirname, 'public/stylesheets/sass'),
  dest : path.join(__dirname, 'public/stylesheets'),
  debug: true,
  indentedSyntax: false,
  outputStyle: 'compressed',
  prefix: '/stylesheets'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/albumlist', albumlist);
app.use('/songs', songs);
app.use('/member', member);
app.use('/artist',artists);
app.use('/api',api);
app.use('*', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
app.listen(5000);
