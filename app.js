const express = require('express');
const nodemailer = require("nodemailer");
const app = express();
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-email', async (req, res) => {
  const { to, from, subject, text } = req.body;
  const recipients = Array.isArray(to) ? to : [to];

  try {
    const info = await transporter.sendMail({
      from: from,
      to: recipients.join(', '), 
      subject: subject,
      text: text,
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email.' });
  }
});

// optional:Test email sending directly without frontend
async function main() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, 
      to: "preethuakhilraj@gmail.com", 
      subject: "Test mail", 
      text: "Test" 
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}


main().catch(console.error);


const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    return console.error(`Failed to start server: ${err.message}`);
  }
  console.log(`Server is listening on port ${port}`);
});
