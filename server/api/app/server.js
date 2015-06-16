/**
 * server.js
 * @author Antoine De Gieter
 * @copyright Net Production Köbe & Co
 * @digest starts the server and listens on port 8989
 */
var express = require('express');
var config = require('./config');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routesQuotation = require('./routes/quotation');
var routesAccess = require('./routes/access');

var server = express();

server.set('view engine', 'jade');


server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
    res.header("Access-Control-Allow-Headers", 
            "Origin, X-Requested-With,Content-Type, Accept");
    next();
});

server.use(bodyParser.json());
server.use(cookieParser());
server.use(logger('dev'));

server.use('/quotation', routesQuotation);
server.use('/access', routesAccess);

// catch 404 and forward to error handler
server.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler development
if (server.get('env') === 'development') {
    server.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            error : err.status,
            message: err.message
        });
    });
}

// error handler production
server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('Error : ' + err.message)
});

server.listen(config.server.port, function() {
    console.log('Server is running on port ' + config.server.port);
    console.log('Press Ctrl-C to kill the server');
});
