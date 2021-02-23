const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

router.post('/register', async (req, res, next) => {
    const {username, password} = req.body;
    
    try {
        const n = await User.countDocuments({});

        if (n >= process.env.MAX_USERS_TO_CREATE)
            return res.status(400).send('Registration is now closed, please contact Admin'); 

        const user = await User.findOne({username});

        if (user) return res.status(400).send('User already exists');

        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hash
        });

        await newUser.save();
        res.send();
    } catch(err) {
        next(err);
    }
});

router.get('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).send(info.message);
        
        req.logIn(user, err => {
            if (err) return next(err);
            res.send({username: user.username, isAdmin: user.isAdmin});
        });
    })(req, res, next);
});

router.get('/logout', async (req, res, next) => {
    req.logOut();
    res.send();
});

module.exports = router;