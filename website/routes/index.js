var express = require('express');
var router = express.Router();
var repo = require('../repo');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Sphero!',
    data: repo.state
  });
});

module.exports = router;
