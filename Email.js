const mongoose = require('mongoose');

// Define the schema for storing email submissions
const emailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email format validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    contact: { type: String, required: true },
    phone: { 
        type: String, 
        validate: {
            validator: function(v) {
                return !v || /^[0-9]{10,15}$/.test(v); // Optional phone number validation (10-15 digits)
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
});

// Create the model from the schema
const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
