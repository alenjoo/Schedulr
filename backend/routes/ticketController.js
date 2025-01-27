const express = require("express");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.get("/", ticketController.getTicketSalesByTime);
router.get("/hi",ticketController.getRevenueByEvent)
module.exports = router;
