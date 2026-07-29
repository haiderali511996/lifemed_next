const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    // In production, integrate with nodemailer or similar
    console.log('Contact form submission:', { name, email, phone, subject, message });
    res.json({ success: true, message: 'Your message has been received. We\'ll respond within 24 hours.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
