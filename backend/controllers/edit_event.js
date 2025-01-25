const pool = require("../config/db");

const getEvent = async (req, res) => {
  const { event_id } = req.params;  

  try {
    const [rows] = await pool.query("SELECT * FROM Events WHERE event_id = ?", [
      event_id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(rows[0]); 
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};

const editEvent = async (req, res) => {
  const { event_id } = req.params; 
  const { title, description, location, date, time, category, price } = req.body;  

  try {
    const result = await pool.query(
      "UPDATE Events SET title = ?, description = ?, location = ?, date = ?, time = ?, category = ?, price = ? WHERE event_id = ?",
      [title, description, location, date, time, category, price, event_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found or no changes made" });
    }

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Failed to update event" });
  }
};

module.exports = { getEvent, editEvent };
