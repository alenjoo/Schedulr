const db = require('../config/db');
const jwt = require('jsonwebtoken'); 
const JWT_SECRET = 'your_jwt_secret_key';

const loginUser = async (req, res) => {
    const { email, password } = req.body; 
    console.log(email);

    const query = 'SELECT * FROM Users WHERE email = ?';
    
    try {
        const [results] = await db.query(query, [email]);
        console.log('Query Results:', results);

        if (results.length > 0) {
            const user = results[0];
            if (password === user.password) {
                const token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
                    JWT_SECRET,
                    { expiresIn: '1h' } 
                );

                return res.status(200).json({ 
                    success: true, 
                    message: 'User found and login successful', 
                    token: token 
                });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid password' });
            }
        } else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error('Error querying database:', err.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
const getUser = async (req, res) => {
    const { userId } = req.params; // Extract userId from URL parameters

    const query = 'SELECT * FROM Users WHERE id = ?';

    try {
        const [results] = await db.query(query, [userId]);

        if (results.length > 0) {
            const userDetails = results[0]; // Extract the user details

            // Send the user details to the frontend
            return res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                userDetails,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
    } catch (err) {
        console.error('Error querying database:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};


module.exports = { loginUser, getUser };
