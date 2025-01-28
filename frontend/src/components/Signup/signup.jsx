import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone_number: '',
    dob: '',
    gender: '',
    location: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/register', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Error during registration. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="signup-input-group">
          <label htmlFor="name" className="signup-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="signup-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="email" className="signup-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="signup-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="phone_number" className="signup-label">Phone Number</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            className="signup-input"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="dob" className="signup-label">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            className="signup-input"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="gender" className="signup-label">Gender</label>
          <select
            id="gender"
            name="gender"
            className="signup-input"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div className="signup-input-group">
          <label htmlFor="location" className="signup-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className="signup-input"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="password" className="signup-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="signup-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="signup-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="signup-input-group">
          <label htmlFor="role" className="signup-label">Role</label>
          <select
            id="role"
            name="role"
            className="signup-input"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select your role</option>
            <option value="Organizer">Organizer</option>
            <option value="Attendee">Attendee</option>
          </select>
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
