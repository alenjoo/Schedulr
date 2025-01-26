const pool = require("../config/db");

const getMyEvents = async (req, res) => {
  const { user_id } = req.query; 

  const query = `
    SELECT 
      e.event_id, 
      e.title, 
      e.location, 
      e.date, 
      e.category, 
      e.price 
    FROM bookings b
    JOIN events e ON b.event_id = e.event_id
    WHERE b.user_id = ?;
  `;
  
  try {
    const [results] = await pool.query(query, [user_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }

    res.status(200).json(results); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};


const cancelBooking = async (req, res) => {
  const { user_id, event_id } = req.body; 

  const checkBookingQuery = `
    SELECT * FROM bookings
    WHERE user_id = ? AND event_id = ?;
  `;
  
  const cancelBookingQuery = `
    DELETE FROM bookings
    WHERE user_id = ? AND event_id = ?;
  `;

  try {
    const [bookingCheck] = await pool.query(checkBookingQuery, [user_id, event_id]);

    if (bookingCheck.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const [deleteResult] = await pool.query(cancelBookingQuery, [user_id, event_id]);

    if (deleteResult.affectedRows === 0) {
      return res.status(400).json({ message: 'Failed to cancel booking' });
    }

    res.status(200).json({ success: true, message: 'Booking canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while canceling booking' });
  }
};

module.exports = {
  getMyEvents,
  cancelBooking,
};
