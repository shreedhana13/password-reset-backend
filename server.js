const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// Simulated user data and reset tokens (Replace this with a database)
const users = [
  { email: 'user@example.com', password: 'hashedPassword' },
  // Add more user data as needed
];

const resetTokens = {};

// NodeMailer setup (replace with your email service configuration)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Endpoint to initiate the password reset
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  resetTokens[token] = email;

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Error sending email' });
    }

    res.status(200).json({ message: 'Reset email sent' });
  });
});

// Endpoint to handle password reset
app.post('/api/reset-password', (req, res) => {
  const { token, password } = req.body;
  const email = resetTokens[token];

  if (!email) {
    return res.status(404).json({ error: 'Invalid token' });
  }

  // Reset token is valid - Update password in the database (replace with database query)
  const user = users.find((user) => user.email === email);
  user.password = password;

  // Remove reset token
  delete resetTokens[token];

  res.status(200).json({ message: 'Password reset successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
