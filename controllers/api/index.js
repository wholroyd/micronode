var express = require('express');
var router = module.exports = express.Router();

router.get('/api', function (req, res) {
    res.send('1');
});

// Returns all the parks in the collection
router.get('/api/user', function (req, res) {
    req.db.collection('Users').find().toArray(function (err, names) {
        res.header("Content-Type:", "application/json");
        res.end(JSON.stringify(names));
    });
});

//find a single park by passing in the objectID to the URL
router.get('/api/parks/park/:id', function (req, res) {

    var BSON = mongodb.BSONPure;
    var parkObjectID = new BSON.ObjectID(req.params.id);

    req.db.collection('parkpoints').find({
        '_id': parkObjectID
    }).toArray(function (err, names) {
        res.header("Content-Type:", "application/json");
        res.end(JSON.stringify(names));
    });
});

//find parks near a certain lat and lon passed in as query parameters (near?lat=45.5&lon=-82)
router.get('/api/parks/near', function (req, res) {

    //in production you would do some sanity checks on these values before parsing and handle the error if they don't parse
    var lat = parseFloat(req.query.lat);
    var lon = parseFloat(req.query.lon);

    req.db.collection('parkpoints').find({
        "pos": {
            $near: [lon, lat]
        }
    }).toArray(function (err, names) {
        res.header("Content-Type:", "application/json");
        res.end(JSON.stringify(names));
    });
});

//find parks near a certain park name, lat and lon (name?lon=10&lat=10)
router.get('/api/parks/name/near/:name', function (req, res) {

    //in production you would do some sanity checks on these values before parsing and handle the error if they don't parse
    var lat = parseFloat(req.query.lat);
    var lon = parseFloat(req.query.lon);
    var name = req.params.name;

    self.db.collection('parkpoints').find({
        "Name": {
            $regex: name,
            $options: 'i'
        },
        "pos": {
            $near: [lon, lat]
        }
    }).toArray(function (err, names) {
        res.header("Content-Type:", "application/json");
        res.end(JSON.stringify(names));
    });
});

//saves new park
router.post('/api/parks/park', function (req, res) {

    //in production you would do some sanity checks on these values before parsing and handle the error if they don't parse
    var lat = parseFloat(req.body.lat);
    var lon = parseFloat(req.body.lon);
    var name = req.body.name;

    self.db.collection('parkpoints').insert({
        'Name': name,
        'pos': [lon, lat]
    }, {
        w: 1
    }, function (err, records) {
        if (err) {
            throw err;
        }
        res.end('success');
    });
});