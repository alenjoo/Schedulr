const express = require("express");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.get("/", ticketController.getTicketSalesByTime);
router.get("/rev",ticketController.getRevenueByEvent)
router.get('/dem', ticketController.getDemographics);

module.exports = router;
