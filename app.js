'use strict';
var logger = require('morgan');
var express = require('express');
var compression = require('compression');
var app = express();

app.use(logger('dev'));
app.use(compression());

app.use(express.static(__dirname + '/build'));

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/build/index.html')
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            status: 'error',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        status: 'error',
        message: err.message,
        error: {}
    });
});

module.exports = app;