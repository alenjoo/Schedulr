const express = require("express");
const { bookTicket } = require("../controllers/book");

const router = express.Router();

router.post("/", bookTicket);

module.exports = router;
