require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
const port = 3000;  // You can change this to any port you prefer

// Twilio credentials from .env file
const accountSid = process.env.TWILIO_ACCOUNG_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');  // Serve index.html
});

// Route to handle SMS sending
app.post('/send-sms', async (req, res) => {
    const { toNumber, messageBody } = req.body;

    let msgOptions = {
        from: process.env.TWILIO_FROM_NUMBER,  // Your Twilio number
        to: toNumber,  // Recipient's phone number
        body: messageBody,  // The message content
    };

    try {
        const message = await client.messages.create(msgOptions);
        console.log("Message sent:", message);
        res.status(200).json({ success: true });
    } catch (err) {
        console.log("Error sending message:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
