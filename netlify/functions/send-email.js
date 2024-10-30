const nodemailer = require('nodemailer');

// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
    // Optional: Uncomment if you want to enable secure connections
    // secure: true, // Use true for 465, false for other ports
    debug: true, // Show debug output
    logger: true // Enable logging
});

// Function to send email
const sendEmail = async (to, subject, body, isHTML = false) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: to, // List of receivers
        subject: subject, // Subject line
        text: isHTML ? undefined : body, // Plain text body
        html: isHTML ? body : undefined, // HTML body if required
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error(`Failed to send email: ${error.message}`); // Re-throw the error with a clear message
    }
};

module.exports = sendEmail;

