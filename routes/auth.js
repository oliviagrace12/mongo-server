const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQCCHv5sfIOEYf+4TNLfoUIre5GcpJGxb2t1c/TWOvFjE2x1VMwJ
bGzurdeeUss+PcItjuTNixOGNx7YO+HLZkLoW6WXlv9LWtHnbZvpzTZCTrfDxA4B
n/w3NEFp3tiu+CV8QRphvU1kYTbUo4+3Ko9eVNtt/BfLxsSpqQUaraunxQIDAQAB
AoGBAIBZnDNcusnpdLnRpawLP97uW5p8xm2UbxYDFD4BFDvbW/98bmrZNbZVajt0
haBWgOQ5cD3DcrXQRy+aGcZtj45ytqn2XgXpEiklq24cPflNB+1/BDxqylNT/CJf
wpi0vAKRqZRumF66mpeXy++3aaoLrIEcwyXRLU7HOCHf2wC9AkEA+1srhI5TXtCP
3TuN/vTksESYS4mJzKwi4sfbjEqq4ZyKwIsgHWhiJIVqxVl7OgSBgOkb/Fxcgu58
gn8rZyRw+wJBAISGbDnye3mPQkh6iylnheGTkrjv8nglB10TeKlE2fmhoR4cdfz4
JokN3XIWYZAj9TZ6teo4TUg8XNoEwJD4bj8CQQCcw+3OTJ3+ooE3b69N9hqzPPTn
F67T8gAIBLIPO3p8H5ACKkMrVDDxqiw/TWGne6vxZHHJ4SjpmCgbk4jUWUwFAkAk
UEk7n6wh5RV+ksWrNMjExRFBR86jCVJ5OKqph0pLUvS5MYdLKBw3FeuGJYfaXWAF
654JbiAPGStAOmkh0FE1AkEA8xkuzjVyHhsMG8kni0+h4iVyGc5GKZfvHQ23wzoN
I6lRcdmQQMSrPMfNne1bxtOSFdbZhNosi5uoHZcGKYeBWQ==
-----END RSA PRIVATE KEY-----
`;

router.use(function (req, res, next) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      req.hashedPassword = hash;
      next();
    })
  })
})

router.post('/login', async function (req, res, next) {
  if (req.body.username && req.body.password) {
    return await bcrypt
      .compare(req.body.password, "$2b$10$IHrcsd54rxr7RZpg7rGMbOMw5woOsiYhCTmXhCbeItxylVroJ878i")
      .then(result => {
        if (result === true) {
          const token = jwt.sign({ id: "pretend_user_id" }, privateKey, { algorithm: 'RS256' });
          return res.json({ "access_token": token })
        } else {
          return res.status(401).send("Incorrect password")
        }
      }).catch(error => {
        return res.status(500).json({ "error": error.message })
      });
  } else {
    res.status(400).json({ "error": "Missing username or password" })
  }
});

router.post('/register', function (req, res, next) {
  if (req.body.username && req.body.password && req.body.passwordRepeat) {
    if (req.body.password === req.body.passwordRepeat) {
      res.json({ "password": req.body.password, "hashedPassword": req.hashedPassword })
    } else {
      res.status(400).json({ "error": "Passwords do not match" })
    }
  } else {
    res.status(400).json({ "error": "Missing username or password" })
  }
});

module.exports = router;
