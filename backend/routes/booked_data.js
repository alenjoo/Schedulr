const express = require("express");
const { getBookedTickets } = require("../controllers/booked_data");

const router = express.Router();

// Correct endpoint
router.get("/", getBookedTickets);

module.exports = router;
