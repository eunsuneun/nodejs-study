const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// pug 템플릿
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './views');
app.get('/template', (req, res) => {
  res.render('temp');
});

// 지정 포트 바라보게 하기
app.listen(3000, () => {
  console.log('Connected 3000 port !');
});

// 화면 보여주기 (메인)
app.get('/', (req, res) => {
  res.send('Home page');
});

// 화면 보여주기 (로그인)
app.get('/login', (req, res) => {
  res.send('Login page, <img src ="/03.png" width="100px">');
});

// 정적 파일 서비스
app.use(express.static('public'));

// 동적 파일 서비스
app.get('/dynamic', (req, res) => {
  let lis = '';
  for (let i = 1; i <= 5; i++) {
    lis += `<li>coding ${i}</li>`;
  }
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let date = new Date().getDate();
  let output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Static</title>
    </head>
    <body>
      <h1>Hello, Dynamic ! </h1>
      <ul>
        ${lis}
      </ul>
      <div>${year}년 ${month}월 ${date}일</div>
    </body>
    </html>
  `;
  res.send(output);
});

// Query객체
app.get('/topic', (req, res) => {
  const topics = ['JavaScript', 'Node.js', 'Express'];
  let output = `
    <a href="/topic?id=0">JavaScript</a><br>
    <a href="/topic?id=1">Node.js</a><br>
    <a href="/topic?id=2">Express</a><br><br>
    ${topics[req.query.id]}
  `;
  res.send(output);
});

// 시멘틱 url
app.get('/event/:id', (req, res) => {
  const events = ['이벤트1', '이벤트2', '이벤트3'];
  let output = `
  <a href="/event/1">이벤트1</a><br>
  <a href="/event/2">이벤트2</a><br>
  <a href="/event/3">이벤트3</a><br><br>

  ${events[req.params.id - 1]}
  `;
  res.send(output);
});

// post
app.get('/form', (req, res) => {
  res.render('form', { _title: '타이틀 입니다.' });
});

app.get('/form-receiver', (req, res) => {
  let _title = req.query.title;
  let _desc = req.query.desc;
  res.send(`get방식 : ${_title} , ${_desc}`);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.post('/form-receiver', (req, res) => {
  let _title = req.body.title;
  let _desc = req.body.desc;
  res.send(`post 방식 : ${_title} , ${_desc}`);
});
