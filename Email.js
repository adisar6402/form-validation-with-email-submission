const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    phone: { type: String, default: '' }
}, { timestamps: true });

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
