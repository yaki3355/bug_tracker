const mongoose = require('mongoose');
const {connection} = require('../config/db');

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
});

module.exports = connection.model('User', schema);