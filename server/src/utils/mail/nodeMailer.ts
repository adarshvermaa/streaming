import { ENV } from '../../config/env';
import transporter from './transporter..utils';

export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
): Promise<void> => {
    try {
        const mailOptions = {
            from: ENV.SMTP_USER,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};