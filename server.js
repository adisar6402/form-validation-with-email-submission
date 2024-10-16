const express = require('express');
const sendEmail = require('./sendEmail');
const Email = require('./Email'); // Import the Email model
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const multer = require('multer'); // Import multer for handling form data
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize multer for form-data handling
const upload = multer();
app.use(upload.none()); // This will handle non-file multipart/form-data

// Middleware to prevent caching
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Connect to MongoDB using the connection string from the .env file
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Email route
app.post('/send-email', async (req, res) => {
    console.log('Received form data:', req.body); // This should log the form data
    const { name, email, contact, phone } = req.body;

    // Validate inputs
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Validation Error: Name is required.' });
    }
    if (!email || email.trim() === '') {
        return res.status(400).json({ message: 'Validation Error: Email is required.' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Validation Error: Please enter a valid email address.' });
    }
    if (contact === 'phone' && (!phone || phone.trim() === '')) {
        return res.status(400).json({ message: 'Validation Error: Phone number is required if the contact method is phone.' });
    }

    // Construct the email body as an object to pass correctly
    const emailBody = {
        name: name,
        email: email,
        contact: contact,
        phone: phone || '', // Handle phone as optional
    };

    try {
        // Pass the email body object instead of plain string
        await sendEmail(email, 'Form Submission', emailBody);
        
        // Save form details to MongoDB
        const formDetails = new Email({ name, email, contact, phone });
        await formDetails.save();

        res.status(200).json({ message: 'Email sent and details saved successfully' });
    } catch (error) {
        console.error('Error occurred while sending email and saving details:', error);
        res.status(500).json({ message: 'Error sending email and saving details' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
