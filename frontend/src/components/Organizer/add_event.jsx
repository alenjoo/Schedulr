import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './add_event.css';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    category: '',
    price: '',
    ticketsAvailable: '' 
  });
  const navigate=useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAndFormatDate = (dateStr) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (match) {
      const [day, month, year] = match.slice(1);
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) {
        return `${year}-${month}-${day}`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const organizerId = decodedToken.id;

      const eventData = {
        ...eventDetails,
        organizer_id: organizerId
      };

      const formattedDate = validateAndFormatDate(eventDetails.date);
      if (formattedDate) {
        eventData.date = formattedDate;
      } else {
        alert("Invalid date format. Please use dd/mm/yyyy.");
        return;
      }

      console.log(eventData);
      const response = await axios.post('http://localhost:5001/add-event', eventData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Event created:', response.data);
      setEventDetails({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        category: '',
        price: '',
        ticketsAvailable: '' 
      });
      navigate("/organizer")
    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="add-event-container">
      <h2 className="add-event-title">Add New Event</h2>
      <form onSubmit={handleSubmit} className="add-event-form">
        <div className="add-event-form-group">
          <label htmlFor="title" className="add-event-label">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventDetails.title}
            onChange={handleChange}
            className="add-event-input"
            required
          />
        </div>

        <div className="add-event-form-group">
          <label htmlFor="description" className="add-event-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={eventDetails.description}
            onChange={handleChange}
            className="add-event-textarea"
            rows="4"
          />
        </div>

        <div className="add-event-form-group">
          <label htmlFor="location" className="add-event-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventDetails.location}
            onChange={handleChange}
            className="add-event-input"
          />
        </div>

        <div className="add-event-form-row">
          <div className="add-event-form-group">
            <label htmlFor="date" className="add-event-label">Date (dd/mm/yyyy)</label>
            <input
              type="text"
              id="date"
              name="date"
              value={eventDetails.date}
              onChange={handleChange}
              className="add-event-input"
              placeholder="dd/mm/yyyy"
              required
            />
          </div>

          <div className="add-event-form-group">
            <label htmlFor="time" className="add-event-label">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={eventDetails.time}
              onChange={handleChange}
              className="add-event-input"
              required
            />
          </div>
        </div>

        <div className="add-event-form-group">
          <label htmlFor="category" className="add-event-label">Category</label>
          <select
            id="category"
            name="category"
            value={eventDetails.category}
            onChange={handleChange}
            className="add-event-select"
          >
            <option value="">Select Category</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="meetup">Meetup</option>
            <option value="social">Social Event</option>
          </select>
        </div>

        <div className="add-event-form-group">
          <label htmlFor="price" className="add-event-label">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={eventDetails.price}
            onChange={handleChange}
            className="add-event-input"
            min="0"
            step="0.01"
          />
        </div>

        <div className="add-event-form-group">
          <label htmlFor="ticketsAvailable" className="add-event-label">Total Tickets Available</label>
          <input
            type="number"
            id="ticketsAvailable"
            name="ticketsAvailable"
            value={eventDetails.ticketsAvailable}
            onChange={handleChange}
            className="add-event-input"
            min="1"
            required
          />
        </div>

        <button type="submit" className="add-event-button">Create Event</button>
      </form>
    </div>
  );
};

export default AddEvent;
