const nodemailer = require('nodemailer');
const Email = require('./Email'); // Ensure this path is correct

// Function to send email and save details to the database
const sendEmail = async (to, subject, body) => {
    try {
        console.log('Preparing to send email...');
        console.log('Received body object:', body);

        // Validate required fields in the body
        if (!body.name || !body.contact || !body.email) {
            throw new Error('Name, contact method, and email are required');
        }

        // Convert the body object to a string for the email content
        const bodyString = `
            Name: ${body.name}
            Email: ${body.email}
            Preferred Contact: ${body.contact}
            ${body.phone ? `Phone: ${body.phone}` : ''}
        `;

        // Create a transporter using Gmail's SMTP server
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Gmail user from .env
                pass: process.env.GMAIL_PASS  // Gmail pass from .env
            }
        });

        // Define the email options
        const mailOptions = {
            from: process.env.GMAIL_USER, // Sender email
            to: to, // Recipient email
            subject: subject,
            text: bodyString.trim(), // Plain text email
            html: `<p>${bodyString.trim().replace(/\n/g, '<br>')}</p>`, // HTML email with line breaks
            replyTo: process.env.GMAIL_USER // Set reply-to address
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);

        // Save email details to the MongoDB database
        const emailDetails = new Email({
            name: body.name,
            email: to,
            contact: body.contact,
            phone: body.phone || '' // Default to empty string if phone is not provided
        });
        await emailDetails.save();
        console.log('Email details saved to the database');

        // Send confirmation email to the user (optional)
        const confirmationSubject = 'Thank You for Your Submission';
        const confirmationBody = `
            Hi ${body.name},
            Thank you for reaching out! We have received your submission and will get back to you shortly.
            Best regards,
            Your Team
        `;
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: body.email, // Send confirmation to the user's email
            subject: confirmationSubject,
            text: confirmationBody.trim(),
            html: `<p>${confirmationBody.trim().replace(/\n/g, '<br>')}</p>`
        });
        console.log('Confirmation email sent to user:', body.email);

        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email sent and details saved successfully!" })
        };
    } catch (error) {
        console.error('Error occurred during email sending or database save:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }) // Return error message
        };
    }
};

// Ensure this file exports the function correctly
exports.handler = sendEmail;
