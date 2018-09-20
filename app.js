var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var unixTime = require('unix-time');
var jwt = require('jsonwebtoken');

var index = require('./routes/index');
var admin = require('./routes/admin');
var lessees = require('./routes/lessees');
var app = express();
var expressValidator = require('express-validator');
var become_a_lessor = require('./routes/become-a-lessor');

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return  {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Date Usage
unixTime(new Date());

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', index);
app.use('/admin', admin);
app.use('/lessees', lessees);
app.use('/become-a-lessor', become_a_lessor);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  res.status(500).json({
        status : 500,
        message: err.message,
        data : [],
        // error: err
    });
});

module.exports = app;
