const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    retrieveUser(req, res)
  } else {
    res.status(400).json({ "error": "Missing username or password" });
  }
});

async function retrieveUser(req, res) {
  const user = await User.findOne().where('username').equals(req.body.username).exec();
  if (user) {
    return await bcrypt.compare(req.body.password, user.password)
      .then(result => {
        if (result === true) {
          const token = jwt.sign({ id: user._id }, privateKey, { algorithm: 'RS256' });
          return res.json({ "access_token": token })
        } else {
          return res.status(401).json({ "error": "Invalid credentials" })
        }
      }).catch(error => {
        return res.status(500).json({ "error": "User login failed" })
      });
  } else {
    return res.status(500).json({ "error": "Invalid credentials" })
  }
}

router.post('/register', function (req, res, next) {
  if (req.body.username && req.body.password && req.body.passwordRepeat) {
    if (req.body.password === req.body.passwordRepeat) {
      saveNewUser(req, res);
    } else {
      res.status(400).json({ "error": "Passwords do not match" })
    }
  } else {
    res.status(400).json({ "error": "Missing username or password" })
  }
});

async function saveNewUser(req, res) {
  const user = new User({
    "username": req.body.username,
    "password": req.hashedPassword
  })

  user.save()
    .then(savedUser => {
      return res.status(201).json({
        "id": savedUser._id,
        "username": savedUser.username
      })
    }).catch(error => {
      return res.status(500).json({ "error": "User registration failed" })
    })
}

module.exports = router;
