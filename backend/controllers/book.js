const pool = require("../config/db");

const bookTicket = (broadcast) => async (req, res) => {
  const { user_id, event_id, tickets } = req.body;

  if (!user_id || !event_id || !tickets) {
    return res.json({ success: false, message: "All fields are required" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [event] = await connection.query(
      "SELECT ticketsavailable FROM events WHERE event_id = ?",
      [event_id]
    );

    if (!event || event.length === 0) {
      return res.json({ success: false, message: "Event not found" });
    }

    if (event[0].ticketsavailable < 0) {
      return res.json({ success: false, message: "Invalid ticket count in the system" });
    }

    if (event[0].ticketsavailable < tickets) {
      return res.json({ success: false, message: "Not enough tickets available" });
    }

    await connection.query(
      "UPDATE events SET ticketsavailable = ticketsavailable - ? WHERE event_id = ?",
      [tickets, event_id]
    );

    await connection.query(
      "INSERT INTO bookings (user_id, event_id, tickets_booked) VALUES (?, ?, ?)",
      [user_id, event_id, tickets]
    );

    await connection.commit();

    broadcast({ eventId: event_id, ticketsAvailable: event[0].ticketsavailable - tickets });

    return res.json({ success: true, message: "Booking successful" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return res.json({ success: false, message: "Internal server error" });
  } finally {
    connection.release();
  }
};

module.exports = {
  bookTicket,
};
