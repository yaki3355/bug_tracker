const mongoose = require('mongoose');

const connection = mongoose.createConnection(process.env.DB_URI, 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

connection
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err))

module.exports = {
    connection
};