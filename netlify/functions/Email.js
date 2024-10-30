const mongoose = require('mongoose');

// Define the Email schema
const emailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate emails
        lowercase: true, // Normalize email to lowercase
    },
    contact: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: '', // Optional field
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the date when the record is created
    },
});

// Create the Email model
const Email = mongoose.model('Email', emailSchema);

// Export the model
module.exports = Email;
