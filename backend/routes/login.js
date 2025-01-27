const express = require('express');
const { loginUser, getUser } = require('../controllers/login');
const router = express.Router();

router.post('/', loginUser); 
router.get('/:userId', getUser);

module.exports = router;