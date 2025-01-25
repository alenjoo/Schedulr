const express = require("express");
const { getEvents, deleteEvent } = require("../controllers/event_update");

const router = express.Router();

router.get("/:userId", getEvents);

router.delete("/:event_id", deleteEvent);

module.exports = router;
