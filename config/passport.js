const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

const verifyCb = async (username, password, done) => {
    try {
        const user = await User.findOne({username});

        if (!user || !(await bcrypt.compare(password, user.password)))
            return done(null, false, {message: 'Invalid username or password'});

        done(null, user);
    } catch(err) {
        done(err);
    }
};

passport.use(new LocalStrategy(verifyCb));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findById(userId);

        done(null, user);
    } catch(err) {
        done(err);
    }
});