const pool = require("../config/db");

const getEvents = async (req, res) => {
  const userId = req.params.userId; 

  try {
    const [rows] = await pool.query("SELECT * FROM Events WHERE organizer_id = ?", [
      userId,
    ]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.event_id; 

  try {
    const [result] = await pool.query("DELETE FROM Events WHERE event_id = ?", [eventId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

module.exports = { getEvents, deleteEvent };
