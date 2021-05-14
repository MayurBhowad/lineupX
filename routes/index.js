var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const renderData = {
    title: 'home',
    isAuthenticated: false,
    user: 'candidate'
  }

  res.render('home', { renderData });
});

module.exports = router;
