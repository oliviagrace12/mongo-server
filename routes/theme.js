var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Theme = require('../models/Theme');

const privateKey = process.env.JWT_PRIVATE_KEY;

router.post('/add', async function (req, res, next) {
    const theme = new Theme({
        "primaryColor": req.body.primaryColor,
        "secondaryColor": req.body.secondaryColor
    })

    theme.save()
        .then(savedTheme => {
            return res.status(201).json({
                "id": savedTheme._id,
                "primaryColor": savedTheme.primaryColor,
                "secondaryColor": savedTheme.secondaryColor
            })
        }).catch(error => {
            return res.status(500).json({ "error": "User registration failed" })
        })
});

router.get('/getAll', async function (req, res, next) {
    const themes = await Theme.find().exec();
    return res.json(themes);
});

module.exports = router;
