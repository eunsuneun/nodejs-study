var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
app.listen(3000, function () {
  console.log('Connected 3000 port !');
});
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.set('views', './views-file');
app.set('view engine', 'pug');

// 글 작성페이지 화면 출력
app.get('/topic/new', function (req, res) {
  fs.readdir('data', function (err, files) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', { topics: files });
  });
});

// 글 작성해서 /topic으로 post하여 정보 전달
app.post('/topic', function (req, res) {
  var _title = req.body.title;
  var _desc = req.body.desc;
  fs.writeFile('data/' + _title, _desc, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/' + _title);
  });
});

// topic페이지 화면 출력
app.get(['/topic', '/topic/:id'], function (req, res) {
  fs.readdir('data', (err, files) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    var id = req.params.id;
    if (id) {
      // topic페이지 파라미터에 의한 내용 출력
      fs.readFile('data/' + id, 'utf-8', function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view', { topics: files, title: id, desc: data });
      });
    } else {
      // 파라미터 없이 topic페이지
      res.render('view', {
        topics: files,
        title: 'Welcome',
        desc: 'Hello nodejs',
      });
    }
  });
});
