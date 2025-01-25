import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendee = () => {
  const [filters, setFilters] = useState({
    date: "",
    location: "",
    category: "",
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to validate and convert the date input into dd/mm/yyyy format
  const validateAndFormatDate = (dateStr) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/; // dd/mm/yyyy format
    const match = dateStr.match(regex);
    if (match) {
      const [day, month, year] = match.slice(1);
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) {
        return `${year}-${month}-${day}`; // Returns date in yyyy-mm-dd format for backend
      }
    }
    return null; // Return null if the date is invalid
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const { date, location, category } = filters;
      // Format the date to yyyy-mm-dd before sending to backend
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

  useEffect(() => {
    // Initial load with empty filters, to fetch all events.
    handleSearch();
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No events found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Attendee;
