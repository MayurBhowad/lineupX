var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let session = req.session;

  const renderData = {
    title: 'home',
    user: 'candidate'
  }

  res.render('home', { renderData, session });
});

module.exports = router;
