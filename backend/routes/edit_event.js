const express = require("express");
const { getEvent, editEvent } = require("../controllers/edit_event");

const router = express.Router();

router.get("/:event_id", getEvent);

router.put("/:event_id", editEvent);

module.exports = router;
