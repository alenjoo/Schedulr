const pool = require("../config/db");

const searchEvents = async (req, res) => {
  const { date, location, category } = req.query;
  
  let query = "SELECT * FROM Events WHERE 1=1";
  let queryParams = [];

  if (date) {
    query += " AND date = ?";
    queryParams.push(date);
  }
  if (location) {
    query += " AND location LIKE ?";
    queryParams.push(`%${location}%`);
  }
  if (category) {
    query += " AND category = ?";
    queryParams.push(category);
  }

  try {
    const [rows] = await pool.query(query, queryParams);
    res.json(rows);
  } catch (err) {
    console.error("Error searching events:", err);
    res.status(500).json({ message: "Failed to search events" });
  }
};

module.exports = { searchEvents };
