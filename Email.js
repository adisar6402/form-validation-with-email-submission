const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    name: String,
    email: String,
    contact: String,
    phone: String,
    dateSent: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Email', emailSchema);
