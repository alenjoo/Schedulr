import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditEvent = () => {
  const { event_id } = useParams();  // Get the event_id from the URL
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    category: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/get-event/${event_id}`);
        const eventData = response.data;

        // Format the date to match input type="date"
        const formattedDate = new Date(eventData.date).toISOString().split("T")[0]; // Get the date portion only
        setEvent({
          ...eventData,
          date: formattedDate,
        });
      } catch (err) {
        setError("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [event_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!event.title || !event.date || !event.time) {
      setError("Title, Date, and Time are required fields.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5001/edit/${event_id}`, event);
      setSuccessMessage(response.data.message);
    } catch (err) {
      setError("Failed to update event");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Edit Event</h1>
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={event.title || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={event.description || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={event.location || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={event.date || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={event.time || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            name="category"
            value={event.category || ""}
            onChange={handleChange}
          >
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="meetup">Meetup</option>
            <option value="social">Social</option>
          </select>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={event.price || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>

      {/* Display formatted date using toLocaleDateString */}
      <h2>Event Details</h2>
      <table>
        <tbody>
          <tr>
            <td><strong>Event Title:</strong> {event.title}</td>
          </tr>
          <tr>
            <td><strong>Description:</strong> {event.description}</td>
          </tr>
          <tr>
            <td><strong>Location:</strong> {event.location}</td>
          </tr>
          <tr>
            <td><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</td> {/* Format the date */}
          </tr>
          <tr>
            <td><strong>Time:</strong> {event.time}</td>
          </tr>
          <tr>
            <td><strong>Category:</strong> {event.category}</td>
          </tr>
          <tr>
            <td><strong>Price:</strong> {event.price}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EditEvent;
