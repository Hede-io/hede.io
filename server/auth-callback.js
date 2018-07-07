const NodeRSA = require('node-rsa');

const request = require('superagent');

const API = process.env.HEDE_API || "https://localhost:4040/api/";
const LOGIN_ENDPOINT = API.endsWith('/') ? API : API + '/';
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkmKnfvKO4OjuZz9uNM/o
pYv5u7v1pyZ6o0txYCO0q6ePo7cnnx1gpWi/mqpVfMrde8xVJJcnkBspnwbAAJrp
TbMInlSoWGtwp71VzGT55BYQVrh3VAhTugfB/KPrbIJ/5Dq+h6NA4AIY9y7Azb+f
oMkkq8iV/ShRp1ZWFDLhZv/Nt5iTGGc7BvjZTdXUDokGvkrXxgWV12jLxBheEaIn
iNr57tCPDEONmglUwUdXIQ7HBBF2u2ZVEQQy1tIUeklKv+N7Pu84wbdE3K3RlPXZ
VLO0oCm0OIQSMvOPUm5kr4AkO3b2hjPXxHB1Xa9EADb/8rI0IT6BMt/4t5WuWOO9
BwIDAQAB
-----END PUBLIC KEY-----`;
const key = new NodeRSA(publicKey);

function authCallback(opts = {}) {
  return function(req, res) {
    const code = req.query.code;
    const state = req.query.state;
    if (!code) {
      return res.status(401).send({ error: 'missing oauth code' });
    }
    //console.log("code posted:", code);
    request.post(LOGIN_ENDPOINT + 'login/steemconnect').send({
      code
    }).then(loginRes => {
      if (loginRes.status !== 200) {
        throw new Error('HTTP ' + loginRes.status + '\n' + loginRes.body);
      }

      //console.log("access token clear:", loginRes.body.access_token);
      const encrypted =  key.encrypt(loginRes.body.access_token, 'base64');
      //console.log("access token encrypted:", encrypted);

      if (opts.sendCookie === true) {
        res.cookie('access_token', encrypted, { maxAge: loginRes.body.expiry - Date.now(), sameSite:true});
        res.cookie('session', loginRes.body.session, {
          maxAge: loginRes.body.expiry - Date.now(),
          sameSite: true,
        });
      }
      if (opts.allowAnyRedirect === true) {
        res.redirect(state ? state : '/');
      } else {
        res.set('Content-Type','text/html');
        let toRedirect = state && state[0] === '/' ? state : '/';
        res.status(200).send(`<html><head><meta charset="UTF-8"></meta><script>window.location.replace('${toRedirect}');</script></head></html>`);
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
