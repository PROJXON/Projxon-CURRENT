const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const OAuth2Client = new google.auth.OAuth2(
    process.env.EMAIL_CLIENT_ID,
    process.env.EMAIL_CLIENT_SECRET,
    process.env.EMAIL_REDIRECT_URI
);

OAuth2Client.setCredentials({ refresh_token: process.env.EMAIL_REFRESH_TOKEN });

async function getAccessToken() {
    try {
        const { token } = await OAuth2Client.getAccessToken();
        return token;
    } catch (error) {
        console.error("Failed to get access token:", error);
        throw new Error("Failed to authenticate email service.");
    }
}

router.post("/send-email", async (req, res) => {
    const { user_name, user_email, message } = req.body;

    try {
        const accessToken = await getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.EMAIL_CLIENT_ID,
                clientSecret: process.env.EMAIL_CLIENT_SECRET,
                refreshToken: process.env.EMAIL_REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const notificationMailOptions = {
            from: `"Projxon" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, 
            subject: `New Contact Request from ${user_name}`,
            text: `
                Name: ${user_name}
                Email: ${user_email}
                Message: ${message}
            `,
        };

        const confirmationMailOptions = {
            from: `"Projxon" <${process.env.EMAIL_USER}>`,
            to: user_email, 
            subject: "Thank you for contacting us!",
            text: `
                Hi ${user_name},

                Thank you for reaching out to us! We have received your message and will get back to you shortly.

                Best regards,
                The Projxon Team
            `,
        };

        await transporter.sendMail(notificationMailOptions);
        await transporter.sendMail(confirmationMailOptions);
        res.status(200).json({ message: "Emails sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
});

module.exports = router;
