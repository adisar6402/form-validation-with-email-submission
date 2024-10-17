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
    phone: { type: String }
});

// Create the model from the schema
const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
