const express = require('express');
const bodyParser = require('body-parser');
const sendEmail = require('./sendEmail'); // Import sendEmail.js
const cors = require('cors'); // Import CORS
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files and parse request bodies
app.use(cors()); // Enable CORS
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Function to validate email format
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Email route - form handling
app.post('/send-email', async (req, res) => {
    const { name, email, contact, phone } = req.body;

    // Log the incoming request body
    console.log('Received form data:', req.body);

    // Validate inputs
    if (!name || name.trim() === '') {
        console.log('Validation error: Name is required');
        return res.status(400).json({ message: 'Name is required' });
    }

    if (!email || !isValidEmail(email)) {
        console.log('Validation error: Valid email is required');
        return res.status(400).json({ message: 'Valid email is required' });
    }

    if (!contact) {
        console.log('Validation error: Contact method is required');
        return res.status(400).json({ message: 'Contact method is required' });
    }

    if (phone && !/^\d{10}$/.test(phone)) {
        console.log('Validation error: Phone number must be 10 digits');
        return res.status(400).json({ message: 'Phone number must be 10 digits' });
    }

    let body = `Name: ${name}\nEmail: ${email}\nContact Method: ${contact}`;
    if (phone) {
        body += `\nPhone Number: ${phone}`;
    }

    try {
        await sendEmail(email, 'Form Submission', body); // Send the email
        console.log('Email sent successfully to:', email); // Log success
        res.status(200).json({ message: 'Email sent successfully' }); // Success response
    } catch (error) {
        console.error('Error occurred while sending email:', error);
        res.status(500).json({ message: 'Error sending email' }); // Error response
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
