var router = require('express').Router();
function isLogin(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send('로그인 해주세요.');
  }
}
router.use('/secret', isLogin);
router.get('/shirts', function (req, res) {
  res.send('셔츠 파는 페이지');
});
router.get('/pants', function (req, res) {
  res.send('바지 파는 페이지');
});
router.get('/secret', function (req, res) {
  res.send('개인결제창 페이지입니다. 로그인해야만 보이는 페이지입니다.');
});

module.exports = router;
