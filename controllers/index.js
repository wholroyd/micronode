var express = require('express');
var router = module.exports = express.Router();

router.get('/health', function (req, res) {
    res.send('You have reached: /health');
});