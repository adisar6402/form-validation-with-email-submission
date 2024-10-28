const mongoose = require('mongoose');

// Define the email schema
const emailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true,    // Ensure email addresses are unique
        lowercase: true, // Store email in lowercase
        trim: true,      // Trim whitespace
        validate: {
            validator: function(v) {
                // Regular expression for validating email format
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    contact: {
        type: String,
        required: true, // Contact method is required
        enum: ['email', 'phone', 'other'], // Restrict to specific contact methods
    },
    phone: {
        type: String,
        required: false, // Phone is optional
        trim: true,      // Trim whitespace
    },
    dateSent: {
        type: Date,
        default: Date.now, // Default to current date
    },
});

// Export the Email model
module.exports = mongoose.model('Email', emailSchema);
