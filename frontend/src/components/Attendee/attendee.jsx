import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaHeart, FaHome, FaTicketAlt, FaCalendarCheck, FaStar } from "react-icons/fa";
import './attendee.css'

const Attendee = () => {
  const [filters, setFilters] = useState({
    date: "",
    location: "",
    category: "",
  });
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const { date, location, category } = filters;
      const formattedDate = validateAndFormatDate(date);
      if (date && !formattedDate) {
        setError("Invalid date format. Please use dd/mm/yyyy.");
        setLoading(false);
        return;
      }
      const response = await axios.get("http://localhost:5001/search", {
        params: { 
          date: formattedDate, 
          location, 
          category 
        }
      });
      setEvents(response.data);
    } catch (err) {
      setError("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.get("http://localhost:5001/favorites", {
        params: { user_id: userId }
      });
      setFavorites(response.data.map(event => event.event_id));
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const handleBookNow = (eventId) => {
    navigate(`/book_ticket/${eventId}`);
  };

  const handleAddToFavorites = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add favorites.");
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const isFavorite = favorites.includes(eventId);
      const endpoint = isFavorite ? "remove-favorite" : "add-favorite";
      
      const response = await axios.post(`http://localhost:5001/${endpoint}`, {
        user_id: userId,
        event_id: eventId,
      });

      if (response.data.success) {
        setFavorites(prev =>
          isFavorite 
            ? prev.filter(id => id !== eventId)
            : [...prev, eventId]
        );
        alert(`Event ${isFavorite ? "removed from" : "added to"} favorites.`);
      }
    } catch (err) {
      setError("Failed to update favorites.");
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchFavorites();
  }, []);

  return (
    <div className="attendee-container">
      {/* Static Sidebar */}
      <div className="attendee-sidebar">
        <div className="sidebar-menu">
          <ul>
            <li onClick={() => navigate("/")}>
              <FaHome className="mr-2" /> Home
            </li>
           
            <li onClick={() => navigate("/view-booked-tickets")}>
              <FaTicketAlt className="mr-2" /> Booked Tickets
            </li>
            <li onClick={() => navigate("/wishlist")}>
              <FaStar className="mr-2" /> Wishlist
            </li>
          </ul>
        </div>
      </div>

      {/* Header */}
      <div className="attendee-header">
        <h1>Event Dashboard</h1>
      </div>

      {/* Main Content */}
      <div className="attendee-content">
        <div className="content-box">
          {/* Filters */}
          <div className="attendee-filter-container">
            <div>
              <label>Date (dd/mm/yyyy):</label>
              <input
                type="text"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                placeholder="dd/mm/yyyy"
              />
            </div>
            <div>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
              />
            </div>
            <div>
              <label>Category:</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="meetup">Meetup</option>
                <option value="social">Social</option>
              </select>
            </div>
          </div>

          <button className="attendee-button" onClick={fetchEvents}>
            Search Events
          </button>

          {/* Loading and Error States */}
          {loading && <div className="attendee-loading">Loading events...</div>}
          {error && <div className="attendee-error">{error}</div>}

          {/* Events Table */}
          <div className="attendee-table-container">
            <table className="attendee-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event.event_id}>
                      <td>{event.title}</td>
                      <td>{event.location}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.category}</td>
                      <td>₹{event.price}</td>
                      <td>{event.ticketsavailable}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="attendee-button"
                            onClick={() => handleBookNow(event.event_id)}
                          >
                            Book
                          </button>
                          <button
                            onClick={() => handleAddToFavorites(event.event_id)}
                            className="favorite-button"
                          >
                            <FaHeart
                              color={favorites.includes(event.event_id) ? "#e74c3c" : "#ccc"}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendee;