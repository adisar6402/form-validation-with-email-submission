const nodemailer = require('nodemailer'); 
const mongoose = require('mongoose');
require('dotenv').config();

// Database setup and connection to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

// Event listeners for the database connection
const db = mongoose.connection;
db.on('error', (error) => {
    console.error('MongoDB connection error:', error); // Improved error logging
});
db.once('open', () => {
    console.log('MongoDB connected successfully');
});

// Define the email schema
const emailSchema = new mongoose.Schema({
    to: String,
    subject: String,
    body: String,
    date: { type: Date, default: Date.now }
});

const Email = mongoose.model('Email', emailSchema);

// Function to send email and save details to the database
const sendEmail = async (to, subject, body) => {
    // Log the recipient, subject, and body to see what is being sent
    console.log('Preparing to send email...');
    console.log('Recipient:', to); // Log the recipient
    console.log('Subject:', subject); // Log the subject
    console.log('Body:', body); // Log the body

    try {
        // Create a transporter using Gmail's SMTP server
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Gmail user from .env
                pass: process.env.GMAIL_PASS // Gmail pass from .env
            }
        });

        // Define the email options
        let mailOptions = {
            from: process.env.GMAIL_USER, // Sender email
            to: to,
            subject: subject,
            text: body
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);

        // Save email to the MongoDB database
        const email = new Email({
            to: to,
            subject: subject,
            body: body
        });

        await email.save();
        console.log('Email details saved to the database');
    } catch (error) {
        console.error('Error occurred during email sending or database save:', error); // More detailed error logging
    }
};

module.exports = sendEmail;
