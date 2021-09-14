var router = require('express').Router();

router.get('/sports', function (req, res) {
  res.send('스포츠 페이지');
});
router.get('/game', function (req, res) {
  res.send('게임 페이지');
});
module.exports = router;
