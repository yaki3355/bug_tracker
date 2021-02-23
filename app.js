const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
expressSession = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('./config/db');
require('./config/passport');
const signRoute = require('./routes/sign');
const bugRoute = require('./routes/bug');
const userRoute = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(signRoute);
app.use('/users', userRoute);
app.use('/bugs', bugRoute);

app.use((req, res) => {
    res.status(404).send();
});

app.use((err, req, res, next) => {
    console.log('Internal error: ', err);
    res.status(500).send();
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')));

    app.get(/.*/, (req, res) => res.sendFile(path.resolve('public/index.html')));
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));