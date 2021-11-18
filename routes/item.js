var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Item = require('../models/Item');

const privateKey = process.env.JWT_PRIVATE_KEY;

router.use(function (req, res, next) {
    if (req.header("Authorization")) {
        try {
            req.payload = jwt.verify(req.header("Authorization"), privateKey, { algorithms: ['RS256'] });
            next();
        } catch (error) {
            return res.status(401).json({ "error": error })
        }
    } else {
        return res.status(401).json({ "error": "Unauthorized" })
    }
})

router.get('/get', async function (req, res, next) {
    const items = await Item.find().where('user').equals(req.payload.id).exec();
    return res.json(items)
});

router.delete('/delete/:itemId', async function (req, res, next) {
    await Item.deleteOne().where('_id').equals(req.params.itemId)
    return res.json(req.params.itemId)
});

router.post('/create', function (req, res, next) {
    const item = new Item({
        "title": req.body.title,
        "description": req.body.description,
        "createdTime": req.body.createdTime,
        "complete": req.body.complete,
        "completedTime": req.body.completedTime,
        "user": req.payload.id
    })

    item.save()
        .then(savedItem => {
            return res.status(201).json({
                "id": savedItem._id,
                "title": req.body.title,
                "description": req.body.description,
                "createdTime": req.body.createdTime,
                "complete": req.body.complete,
                "completedTime": req.body.completedTime,
                "user": req.payload.id
            })
        })
        .catch(error => {
            return res.status(500).json({ "error": "Failed to save new to-do item" })
        })
});

module.exports = router;
