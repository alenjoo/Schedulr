// controllers/wishlistController.js
const db = require('../config/db'); // Assuming you have a db.js file for DB connections

// Add an event to the wishlist
const addToWishlist = async (req, res) => {
    const { user_id, event_id } = req.body;
  
    if (!user_id || !event_id) {
      return res.status(400).json({ success: false, message: "User ID and Event ID are required." });
    }
  
    try {
      // First, check if the event is already in the wishlist
      const [existingEvent] = await db.query(
        'SELECT * FROM wishlist WHERE user_id = ? AND event_id = ?',
        [user_id, event_id]
      );
  
      if (existingEvent.length > 0) {
        // If event already exists in wishlist, return a success message
        return res.status(200).json({ success: true, message: "Event is already in your wishlist." });
      }
  
      // Insert the event into the wishlist table
      const result = await db.query(
        'INSERT INTO wishlist (user_id, event_id) VALUES (?, ?)',
        [user_id, event_id]
      );
  
      // If insertion is successful, return a success response
      return res.status(200).json({ success: true, message: "Event added to wishlist!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Failed to add event to wishlist." });
    }
  };
  const removeFromWishlist = async (req, res) => {
    try {
      const { event_id, user_id } = req.body; // Extract both `event_id` and `user_id` from the request body
   console.log(event_id, user_id)
      // Validate inputs
      if (!event_id || !user_id) {
        return res.status(400).json({ success: false, message: "Invalid input." });
      }
  
      // Delete the event from the wishlist table
      const query = "DELETE FROM wishlist WHERE user_id = ? AND event_id = ?";
      const [result] = await db.query(query, [user_id, event_id]);
  
      if (result.affectedRows > 0) {
        return res
          .status(200)
          .json({ success: true, message: "Event removed from wishlist." });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Event not found in wishlist." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to remove event." });
    }
  };
  
  
const getWishlist = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ success: false, message: "User ID is required." });
  }

  try {
    const query = `
      SELECT e.event_id, e.title, e.location, e.date, e.category, e.price, e.ticketsavailable
      FROM events e
      INNER JOIN wishlist w ON w.event_id = e.event_id
      WHERE w.user_id = ?
    `;
    const [rows] = await db.execute(query, [user_id]); // Adjust for your DB client
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch wishlist." });
  }
};


module.exports = { addToWishlist, removeFromWishlist, getWishlist };
