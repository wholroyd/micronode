// Load libraries
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// Configuration
var settings = {};

settings.app = {};
settings.app.port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 80;
settings.app.host = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1';

settings.db = {};
settings.db.port = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
settings.db.host = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1';
settings.db.user = process.env.OPENSHIFT_MONGODB_DB_USERNAME || 'admin';
settings.db.pass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || 'admin';
settings.db.name = process.env.OPENSHIFT_APP_NAME || 'micronode';
settings.db.string =
    settings.db.user + ":" + settings.db.pass + "@" +
    settings.db.host + ':' + settings.db.port;

// Configure Express
var app = express();

// -- views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');

// -- body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// -- mongo
// app.use(require('express-mongo-db')(require('mongodb')), {
//     host: settings.db.string,
//     db: settings.db.name
// });

// -- routes
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./controllers/index.js'));
app.use(require('./controllers/api/index.js'));
app.use(require('./controllers/web/index.js'));

// -- register 404 handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// -- register 500 handler (dev)
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

app.listen(settings.app.port, settings.app.host, function() {
    console.log('%s: Node server started on %s:%d ...', Date(Date.now()), settings.app.host, settings.app.port);
});