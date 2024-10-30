const express = require('express');
const sendEmail = require('./netlify/functions/send-email');
const Email = require('./netlify/functions/Email'); // Import the Email model
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize'); // Use to sanitize inputs
const emailValidator = require('email-validator'); // Use to validate email format
const multer = require('multer');
const upload = multer(); // Initialize multer
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.static(__dirname)); // Serve static files like HTML
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (from forms)
app.use(express.json()); // Parse JSON bodies (from APIs or AJAX requests)

// Middleware to prevent caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// Middleware to add security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME type sniffing
    next();
});

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
        // Start the server after a successful connection
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve index.html
});

// Email route
app.post('/send-email', upload.none(), async (req, res) => {
    console.log('Received form data:', req.body); // Log the form data
    // Sanitize and validate inputs
    const { name, email, contact, phone } = req.body;
    const sanitizedInput = {
        name: sanitize(name),
        email: sanitize(email),
        contact: sanitize(contact),
        phone: sanitize(phone) || '', // Handle phone as optional
    };

    // Validate inputs
    if (!sanitizedInput.name || sanitizedInput.name.trim() === '') {
        console.error('Validation Error: Name is required.');
        return res.status(400).json({ message: 'Validation Error: Name is required.' });
    }
    if (!sanitizedInput.email || sanitizedInput.email.trim() === '') {
        console.error('Validation Error: Email is required.');
        return res.status(400).json({ message: 'Validation Error: Email is required.' });
    }
    if (!emailValidator.validate(sanitizedInput.email)) {
        console.error('Validation Error: Please enter a valid email address.');
        return res.status(400).json({ message: 'Validation Error: Please enter a valid email address.' });
    }
    if (sanitizedInput.contact === 'phone' && (!sanitizedInput.phone || sanitizedInput.phone.trim() === '')) {
        console.error('Validation Error: Phone number is required if the contact method is phone.');
        return res.status(400).json({ message: 'Validation Error: Phone number is required if the contact method is phone.' });
    }

    // Continue processing the email sending...
});
