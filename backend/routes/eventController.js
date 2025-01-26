const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Routes for event-related operations
router.get('/', eventController.getMyEvents); // Fetch booked events for a user
router.post('/', eventController.cancelBooking); // Cancel a booking

module.exports = router;
