const express = require("express");
const { getBookedTickets } = require("../controllers/booked_data");

const router = express.Router();

router.get("/", getBookedTickets);

module.exports = router;
