const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect(
  'mongodb+srv://eunsuneun:dmstjsdl2@cluster0.i3hfc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  function (err, client) {
    // 에러 시, 콘솔 출력하고 return종료
    if (err) return console.log(err);
    // db는 몽고디비에서 설정한 todoapp
    db = client.db('todoapp');
    app.listen(8080, () => {
      console.log('Connected 8080 port !');
    });
  }
);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/write', (req, res) => {
  res.sendFile(__dirname + '/write.html');
});
app.post('/add', (req, res) => {
  res.send('Success !');
  db.collection('counter').findOne({ name: '게시물갯수' }, function (err, rst) {
    let totalPosts = rst.total;
    console.log(totalPosts);
    db.collection('post').insertOne(
      { _id: totalPosts + 1, todo: req.body.todo, date: req.body.date },
      function (err, rst) {
        console.log('저장완료');
        db.collection('counter').updateOne(
          { name: '게시물갯수' },
          { $inc: { total: 1 } },
          function (err, rst) {
            if (err) return console.log(err);
          }
        );
      }
    );
  });
});
app.get('/list', (req, res) => {
  db.collection('post')
    .find()
    .toArray(function (err, rst) {
      res.render('list.ejs', { _posts: rst });
    });
});

// 삭제하기
app.delete('/delete', function (req, res) {
  req.body._id = parseInt(req.body._id);
  db.collection('post').deleteOne(req.body, function (err, rst) {
    if (err) return console.log(err);
    console.log('삭제 완료');
    res.status(200).send({ message: '성공했습니다.' }); // 응답코드 200을 보내주세요~ 200은 성공했다는 뜻
    // res.status(400).send({ message: '실패했습니다.' }); // 400은 요청 실패했다는 뜻
  });
});

// 상세페이지
app.get('/detail/:id', function (req, res) {
  db.collection('post').findOne(
    { _id: parseInt(req.params.id) },
    function (err, rst) {
      console.log(rst);
      res.render('detail.ejs', { result: rst });
    }
  );
});

// 수정하기
app.get('/edit/:id', function (req, res) {
  db.collection('post').findOne(
    { _id: parseInt(req.params.id) },
    function (err, rst) {
      console.log(rst);
      res.render('edit.ejs', { result: rst });
    }
  );
});
app.put('/edit', function (req, res) {
  db.collection('post').updateOne(
    { _id: parseInt(req.body.id) },
    { $set: { todo: req.body.todo, date: req.body.date } },
    function (err, rst) {
      res.redirect('/list');
    }
  );
});

// 로그인
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
app.use(
  session({ secret: '비밀코드', resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function (req, res) {
  res.render('login.ejs');
});
app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/fail',
  }),
  function (req, res) {
    res.redirect('/');
  }
);

app.get('/mypage', isLogin, function (req, res) {
  console.log(req.user);
  res.render('mypage.ejs', { 사용자: req.user });
});

function isLogin(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send('로그인 해주세요.');
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'id',
      passwordField: 'pw',
      session: true,
      passReqToCallback: false,
    },
    function (입력한아이디, 입력한비번, done) {
      //console.log(입력한아이디, 입력한비번);
      db.collection('login').findOne(
        { id: 입력한아이디 },
        function (에러, 결과) {
          if (에러) return done(에러);
          if (!결과)
            return done(null, false, { message: '존재하지않는 아이디요' });
          if (입력한비번 == 결과.pw) {
            return done(null, 결과);
          } else {
            return done(null, false, { message: '비번틀렸어요' });
          }
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (아이디, done) {
  db.collection('login').findOne({ id: 아이디 }, function (err, rst) {
    done(null, {});
  });
});
