const { createServer } = require('https');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

// TODO: Very bad practice, should properly settup https with real certificates, not localhost
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost.key'),
  cert: fs.readFileSync('./certificates/localhost.crt'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    var baseURL = 'https://' + req.headers.host + '/';
    var myURL = new URL(req.url, baseURL);
    handle(req, res, myURL);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log(`> Server started on ${process.env.NEXTAUTH_URL}`);
  });
});
