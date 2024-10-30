const nodemailer = require('nodemailer');

// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
    debug: true, // Show debug output
    logger: true // Enable logging
});

// Define the handler function that Netlify will call
exports.handler = async (event) => {
    try {
        // Parse the request body to get email details
        const { to, subject, body, isHTML = false } = JSON.parse(event.body);

        // Create mail options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: to, // Recipient address
            subject: subject, // Subject line
            text: isHTML ? undefined : body, // Plain text body
            html: isHTML ? body : undefined, // HTML body if required
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error.message);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Failed to send email: ${error.message}` }),
        };
    }
};

