const request = require('superagent');

const API = process.env.HEDE_API || "https://localhost:4040/api/";
const LOGIN_ENDPOINT = API.endsWith('/') ? API : API + '/';

function authCallback(opts = {}) {
  return function(req, res) {
    const code = req.query.code;
    const state = req.query.state;
    if (!code) {
      return res.status(401).send({ error: 'missing oauth code' });
    }
    request.post(LOGIN_ENDPOINT + 'login/steemconnect').send({
      code
    }).then(loginRes => {
      if (loginRes.status !== 200) {
        throw new Error('HTTP ' + loginRes.status + '\n' + loginRes.body);
      }
      if (opts.sendCookie === true) {
        res.cookie('session', loginRes.body.session, {
          maxAge: loginRes.body.expiry - Date.now(),
          sameSite: true
        });
      }
      if (opts.allowAnyRedirect === true) {
        res.redirect(state ? state : '/');
      } else {
        res.redirect(state && state[0] === '/' ? state : '/');
      }
    }).catch(err => {
      console.error('Failed to login to API server', err);
      if (err.status === 400) {
        return res.status(400).send({ error: err.response.body.message });
      }
      res.status(500).send({ error: 'Failed to create session' });
    });
  }
}

module.exports = authCallback;
