import nodemailer from 'nodemailer';
import { ENV } from '../../config/env';
// Create a transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: false,
    auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASSWORD, // App password or Gmail password
    },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error configuring transporter:', error);
    } else {
        console.log('Gmail SMTP Transporter is ready to send emails', success);
    }
});

export default transporter;
