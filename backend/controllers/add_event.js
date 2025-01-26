const db = require('../config/db');

const addEvent = (req, res) => {
  const { 
    title, 
    description, 
    location, 
    date, 
    time, 
    category, 
    price,organizer_id, ticketsAvailable
  } = req.body;
  
console.log( title, 
    description, 
    location, 
    date, 
    time, 
    category, 
    price,organizer_id )
  

  const query = `
    INSERT INTO Events 
    (title, description, location, date, time, category, price, organizer_id, ticketsavailable) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [
      title, 
      description, 
      location, 
      date, 
      time, 
      category, 
      price || 0, 
      organizer_id, ticketsAvailable
    ], (error, results) => {
      if (error) {
        res.status(500).json({ 
          message: 'Error creating event', 
          error: error.message 
        });
        return reject(error);
      }
      
      res.status(201).json({ 
        message: 'Event created successfully', 
        eventId: results.insertId 
      });
      resolve(results);
    });
  });
};

module.exports = { addEvent };