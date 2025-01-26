import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";  

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id; 

        const response = await axios.get(`http://localhost:5001/get-events/${userId}`);
        console.log(response.data);
        setEvents(response.data);
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (event_id) => {
    try {
      const response = await axios.delete(`http://localhost:5001/delete/${event_id}`);
      console.log(response.data.message); 
      setEvents(events.filter(event => event.event_id !== event_id)); 
    } catch (err) {
      console.error("Error deleting event", err);
      setError("Failed to delete event");
    }
  };

  const handleEdit = (event_id) => {
    navigate(`/edit-event/${event_id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Your Events</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
            <th>Category</th>
            <th>Price</th>
            <th>Tickets Available</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.event_id}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{event.location}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.time}</td>
                <td>{event.category}</td>
                <td>{event.price}</td>
                <td>{event.ticketsavailable}</td>
                <td>
                  <button onClick={() => handleEdit(event.event_id)}>Edit</button>
                  <button onClick={() => handleDelete(event.event_id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No events found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventsPage;
