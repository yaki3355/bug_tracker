const mongoose = require('mongoose');
const mongooseAutoIncrement = require('mongoose-auto-increment');
const {connection} = require('../config/db');

mongooseAutoIncrement.initialize(connection);

const schema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    responsible: {
        type: String,
        required: true
    },
    comments: {
        type: [{
            _id: false,
            createdAt: {
                type : Date,
                default : Date.now
            },
            createdBy: String,
            description: String
        }]
    },
    createdAt: {
        type : Date,
        default : Date.now
    },
    createdBy: {
        type: String
    },
    updatedAt: {
        type : Date,
        default : Date.now
    },
    updatedBy: {
        type: String
    }
});

schema.plugin(mongooseAutoIncrement.plugin, 'Bug')

module.exports = connection.model('Bug', schema);