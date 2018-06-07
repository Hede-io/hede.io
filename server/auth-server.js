const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const authCallback = require('./auth-callback');
const app = express();

app.get('/callback', authCallback({ sendCookie: true }));
app.get('/connect', authCallback({ allowAnyRedirect: true }));

let server;
if (process.env.SERVER_SSL_CERT && process.env.SERVER_SSL_KEY) {
  const options = {
    cert: fs.readFileSync(process.env.SERVER_SSL_CERT),
    key: fs.readFileSync(process.env.SERVER_SSL_KEY)
  };

  server = https.createServer(options, app);
} else {
  server = http.createServer(app);
}

server.listen(3001, 'localhost', () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Auth server running at %s:%s/', host, port);
 
});
