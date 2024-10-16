const nodemailer = require('nodemailer');
const Email = require('./Email'); // Import the Email model

// Function to send email and save details to the database
const sendEmail = async (to, subject, body) => {
    console.log('Preparing to send email...');
    console.log('Recipient:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);

    try {
        // Log the body to ensure the structure is correct
        console.log('Received body object:', body);

        // Validate required fields in the body
        if (!body.name || !body.contact) {
            throw new Error('Name and contact method are required');
        }

        // Convert the body object to a string for the email
        const bodyString = `
            Name: ${body.name}
            Email: ${body.email}
            Preferred Contact: ${body.contact}
            ${body.phone ? `Phone: ${body.phone}` : ''}
        `;

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
            text: bodyString, // For plain text
            html: `<p>${bodyString.replace(/\n/g, '<br>')}</p>` // Converts new lines to <br> tags for HTML
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);

        // Save email details to the MongoDB database
        const emailDetails = new Email({
            name: body.name, // Ensure body.name is correctly passed
            email: to,
            contact: body.contact,
            phone: body.phone || '' // Default to empty string if phone is not provided
        });
        await emailDetails.save();
        console.log('Email details saved to the database');
    } catch (error) {
        console.error('Error occurred during email sending or database save:', error);
        throw error; // Throw the error to handle it in the calling function
    }
};

module.exports = sendEmail;
