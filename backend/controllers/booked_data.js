const pool = require("../config/db");

const getBookedTickets = async (req, res) => {
    try {
        const userId = req.query.user_id;
      console.log(userId)
          const query = `
        SELECT e.event_id, e.title, e.location, e.date, e.category, e.price
        FROM events e
        JOIN bookings b ON b.event_id = e.event_id
        WHERE b.user_id = ?
      `;
  
      const [rows] = await pool.query(query, [userId]);
  
      if (rows.length > 0) {
        res.status(200).json({ success: true, data: rows });
      } else {
        res.status(404).json({ success: false, message: "No booked tickets found." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to fetch booked tickets." });
    }
  };

  
module.exports = {
    getBookedTickets
  };
  