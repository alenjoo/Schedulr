import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './add_event.css';

const AddEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    category: '',
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Decode token to get organizer ID
      const decodedToken = jwtDecode(token);
      const organizerId = decodedToken.userId;

      // Prepare event data
      const eventData = {
        ...eventDetails,
        organizer_id: organizerId
      };

      // Send POST request
      const response = await axios.post('http://localhost:5001/add-event', eventData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Handle successful response
      console.log('Event created:', response.data);
      
      // Reset form
      setEventDetails({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        category: '',
        price: ''
      });

    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="add-event-container">
      <h2 className="add-event-title">Add New Event</h2>
      <form onSubmit={handleSubmit} className="add-event-form">
        {/* Existing form fields remain the same */}
        <button type="submit" className="add-event-button">Create Event</button>
      </form>
    </div>
  );
};

export default AddEvent;