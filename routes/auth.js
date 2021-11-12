const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const privateKey = `

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
