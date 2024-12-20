const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define the email sending route
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, contact, phone } = req.body; // Adjusted to match the form fields

        // Create mail options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: process.env.EMAIL_USER, // Send to yourself or adjust as needed
            subject: `New contact from ${name}`, // Dynamic subject
            text: `You have a new message from ${name} (${email}). Preferred contact method: ${contact}. Phone: ${phone || 'N/A'}`,
            html: `<p>You have a new message from <strong>${name}</strong> (${email}).</p><p>Preferred contact method: <strong>${contact}</strong></p><p>Phone: <strong>${phone || 'N/A'}</strong></p>`, // HTML body
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', process.env.EMAIL_USER);

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error.message);

        return res.status(500).json({ message: `Failed to send email: ${error.message}` });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
