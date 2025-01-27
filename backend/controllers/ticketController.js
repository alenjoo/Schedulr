const pool = require("../config/db");

const getTicketSalesByTime = async (req, res) => {
  const query = `
    SELECT
      CASE 
        WHEN HOUR(booking_date) BETWEEN 0 AND 5 THEN 'Night'
        WHEN HOUR(booking_date) BETWEEN 6 AND 11 THEN 'Morning'
        WHEN HOUR(booking_date) BETWEEN 12 AND 17 THEN 'Afternoon'
        ELSE 'Evening'
      END AS time_of_day,
      COUNT(*) AS total_bookings
    FROM bookings
    GROUP BY time_of_day;
  `;

  try {
    const [results] = await pool.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching ticket sales:", error);
    res.status(500).send("Internal Server Error");
  }
};


const getRevenueByEvent = async (req, res) => {
  const query = `
    
SELECT 
  events.event_id, 
  events.title, 
  SUM(payments.amount) AS total_revenue
FROM 
  payments
JOIN 
  events ON payments.event_id = events.event_id
GROUP BY 
  events.event_id, events.title;

  `;

  try {
    const [results] = await pool.query(query);
    console.log(results)
    res.json(results); 
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = { getTicketSalesByTime, getRevenueByEvent};
