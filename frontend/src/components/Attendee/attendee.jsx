import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Attendee = () => {
  const [filters, setFilters] = useState({
    date: "",
    location: "",
    category: "",
  });
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]); // State for user's booked events
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
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

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const { date, location, category } = filters;
      const formattedDate = validateAndFormatDate(date);
      if (formattedDate) {
        const response = await axios.get("http://localhost:5001/search", {
          params: { date: formattedDate, location, category },
        });
        setEvents(response.data);
      } else {
        setError("Invalid date format. Please use dd/mm/yyyy.");
      }
    } catch (err) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await axios.get("http://localhost:5001/my-events", {
        params: { user_id: userId },
      });
      setMyEvents(response.data);
    } catch (err) {
      setError("Failed to fetch your events");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (eventId) => {
    navigate(`/book_ticket/${eventId}`);
  };

  const handleCancelBooking = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in.");
      navigate("/login");
      return;
    }
  
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
  
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5001/cancel-booking", {
        user_id: userId,
        event_id: eventId,
      });
      const { success, message } = response.data;
      if (success) {
        alert(message || "Booking canceled successfully!");
        // Remove the canceled event from the myEvents state immediately
        setMyEvents((prevEvents) =>
          prevEvents.filter((event) => event.event_id !== eventId)
        );
      } else {
        alert(message || "Failed to cancel booking. Please try again.");
      }
    } catch (err) {
      setError("Failed to cancel booking.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    handleSearch();
    fetchMyEvents(); // Fetch user events when the component loads
  }, []);

  return (
    <div>
      <h1>Events</h1>
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
      <div>
        <button onClick={handleSearch}>Apply Filters</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <h2>Event List</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Date</th>
            <th>Category</th>
            <th>Price</th>
            <th>Tickets Available</th>
            <th>Action</th>
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
                <td>{event.price}</td>
                <td>{event.ticketsavailable}</td>
                <td>
                  <button onClick={() => handleBookNow(event.event_id)}>
                    Book Now
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No events found</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>My Events</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Date</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {myEvents.length > 0 ? (
            myEvents.map((event) => (
              <tr key={event.event_id}>
                <td>{event.title}</td>
                <td>{event.location}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.category}</td>
                <td>{event.price}</td>
                <td>
                  <button onClick={() => handleCancelBooking(event.event_id)}>
                    Cancel Booking
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">You have not booked any events</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Attendee;
