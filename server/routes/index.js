const express = require('express');
const router = express.Router();
const blogRoute = require('./blogs');
const userRoute = require('./users');
const emailRoute = require('./emails');
const clientRoute = require('./clients');
const authRoute = require('./auth');
const uploadRoute = require('./upload');
const oauth2Route = require('./oauth2');

router.get('/', (req, res) => {
    res.send('API is working');
});

router.use('/blogs', blogRoute);
router.use('/emails', emailRoute);
router.use('/clients', clientRoute);
router.use('/auth', authRoute);
router.use('/upload', uploadRoute);
router.use('/oauth2', oauth2Route);

module.exports = router;