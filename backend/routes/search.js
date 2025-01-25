const express = require("express");
const { searchEvents } = require("../controllers/search");

const router = express.Router();

router.get("/", searchEvents);

module.exports = router;
