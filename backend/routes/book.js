const express = require("express");
const { bookTicket, getBookedTickets } = require("../controllers/book");

const router = express.Router();

router.post("/", bookTicket);
router.get("/",getBookedTickets);
module.exports = router;
