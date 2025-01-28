const pool = require("../config/db");
const getTicketSalesByTime = async (req, res) => {
  const organizerId = req.query.organizerId || req.body.organizerId; 
  
  if (!organizerId) {
    return res.status(400).json({ message: 'Organizer ID is required' });
  }

  const query = `
    SELECT
      CASE 
        WHEN HOUR(booking_date) BETWEEN 0 AND 5 THEN 'Night'
        WHEN HOUR(booking_date) BETWEEN 6 AND 11 THEN 'Morning'
        WHEN HOUR(booking_date) BETWEEN 12 AND 17 THEN 'Afternoon'
        ELSE 'Evening'
      END AS time_of_day,
      COUNT(*) AS total_bookings
    FROM 
      bookings
    JOIN 
      events ON bookings.event_id = events.event_id
    WHERE 
      events.organizer_id = ? 
    GROUP BY time_of_day;
  `;

  try {
    const [results] = await pool.query(query, [organizerId]); 
    res.json(results);
  } catch (error) {
    console.error('Error fetching ticket sales:', error);
    res.status(500).send('Internal Server Error');
  }
};


const getRevenueByEvent = async (req, res) => {
  const userId = req.query.userId; 
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = `
    SELECT 
      events.event_id, 
      events.title, 
      SUM(payments.amount) AS total_revenue
    FROM 
      payments
    JOIN 
      events ON payments.event_id = events.event_id
    WHERE 
      events.organizer_id = ? 
    GROUP BY 
      events.event_id, events.title;
  `;

  try {
    const [results] = await pool.query(query, [userId]); 
    res.json(results);
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).send('Internal Server Error');
  }
};
const getDemographics = async (req, res) => {
  const userId = req.query.userId;

  const query = `
    SELECT 
      CASE
        WHEN TIMESTAMPDIFF(YEAR, dob, CURDATE()) BETWEEN 18 AND 24 THEN '18-24'
        WHEN TIMESTAMPDIFF(YEAR, dob, CURDATE()) BETWEEN 25 AND 34 THEN '25-34'
        WHEN TIMESTAMPDIFF(YEAR, dob, CURDATE()) BETWEEN 35 AND 44 THEN '35-44'
        WHEN TIMESTAMPDIFF(YEAR, dob, CURDATE()) >= 45 THEN '45+'
        ELSE 'Unknown'
      END AS ageGroup,
      COUNT(*) AS attendeesCount
    FROM Users
    JOIN bookings ON bookings.user_id = Users.id
    JOIN Events ON Events.event_id = bookings.event_id  -- Join Events table
    WHERE Users.role = 'Attendee' 
      AND Events.organizer_id = ?  -- Filter by the organizer ID (userId)
    GROUP BY ageGroup;
  `;

  try {
    const [rows] = await pool.query(query, [userId]);
    res.status(200).json(rows); 
  } catch (error) {
    console.error('Error fetching demographics data:', error);
    res.status(500).json({ message: 'Failed to fetch demographics data' });
  }
};


module.exports = { getTicketSalesByTime, getRevenueByEvent, getDemographics};
