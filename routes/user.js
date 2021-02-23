const router = require('express').Router();
const {isAuth} = require('./auth');
const User = require('../models/user');

router.get('/names', isAuth, async (req, res, next) => {
    try {
        const names = await User.find({}, {username: 1, _id: 0});

        res.json(names);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
