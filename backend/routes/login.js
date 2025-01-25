const express = require('express');
const { loginUser } = require('../controllers/login');
const router = express.Router();

router.post('/', loginUser); // Use POST method here

module.exports = router;