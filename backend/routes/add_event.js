const express = require('express');
const router = express.Router();
const { addEvent } = require('../controllers/add_event');    

router.post('/',  addEvent);
module.exports = router;