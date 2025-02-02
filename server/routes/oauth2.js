const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/callback', async (req, res) => {
  try {
    const authorizationCode = req.query.code;
    if (!authorizationCode) {
      return res.status(400).json({ message: 'Authorization code is missing' });
    }

    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code: authorizationCode,
      client_id: process.env.EMAIL_CLIENT_ID,
      client_secret: process.env.EMAIL_CLIENT_SECRET,
      redirect_uri: EMAIL_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const accessToken = response.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
