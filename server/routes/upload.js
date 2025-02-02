const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', authenticateUser, upload.single('file'), async (req, res) => {
  try {
      const file = req.file;

      if (!file) {
          return res.status(400).json({ message: 'No file uploaded' });
      }

      const form = new FormData();
      form.append('file', file.buffer, file.originalname);

      const jwtToken = req.headers.authorization.split(" ")[1]; 

      const response = await axios.post(
          `${process.env.WORDPRESS_API_URL}/media`,
          form,
          {
              headers: {
                  ...form.getHeaders(),
                  'Authorization': `Bearer ${jwtToken}`, 
              },
          }
      );

      res.status(200).json({ url: response.data.source_url });
  } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Error uploading image' });
  }
});

module.exports = router;
