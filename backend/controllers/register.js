const db = require('../config/db');

const registerUser = async (req, res) => {
  const { name, email, password, role, phone_number, dob, gender, location } = req.body;

  if (!name || !email || !password || !role || !phone_number || !dob || !gender || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const checkUserQuery = 'SELECT * FROM Users WHERE email = ?';
  try {
    const [existingUser] = await db.query(checkUserQuery, [email]); 
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
  } catch (error) {
    console.error('Error checking existing user:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }

  const insertUserQuery = `
    INSERT INTO Users (name, email, password, role, phone_number, dob, gender, location) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    await db.query(insertUserQuery, [name, email, password, role, phone_number, dob, gender, location]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { registerUser };
