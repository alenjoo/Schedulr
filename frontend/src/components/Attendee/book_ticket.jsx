import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 

const BookTicket = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`http://localhost:5001/get-event/${eventId}`);
        setEventDetails(response.data);
      } catch (err) {
        setError("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.eventId === eventId) {
        setEventDetails((prevDetails) => ({
          ...prevDetails,
          ticketsavailable: data.ticketsAvailable,
        }));
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event);
    };

    return () => {
      ws.close();
    };
  }, [eventId]);

  const handleTicketChange = (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value, 10), 1), eventDetails.ticketsavailable);
    setTicketCount(value);
  };

  const handleBooking = async () => {
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

      const response = await axios.post("http://localhost:5001/book", {
        event_id: eventId,
        tickets: ticketCount,
        user_id: userId,
      });

      const { success, message } = response.data;
      if (success) {
        alert(message || "Tickets booked successfully!");
        navigate("/");
      } else {
        alert(message || "Failed to book tickets. Please try again.");
      }
    } catch (err) {
      console.error("Error during booking:", err);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!eventDetails && !loading && !error) {
    navigate("/events");
    return null;
  }

  return (
    <div>
      <h1>Book Ticket</h1>
      {eventDetails ? (
        <div>
          <h2>{eventDetails.title}</h2>
          <p><strong>Location:</strong> {eventDetails.location}</p>
          <p><strong>Date:</strong> {new Date(eventDetails.date).toLocaleDateString()}</p>
          <p><strong>Category:</strong> {eventDetails.category}</p>
          <p><strong>Price:</strong> ${eventDetails.price}</p>
          <p><strong>Tickets Available:</strong> {eventDetails.ticketsavailable}</p>

          <div>
            <label htmlFor="ticketCount">Number of Tickets:</label>
            <input
              type="number"
              id="ticketCount"
              value={ticketCount}
              onChange={handleTicketChange}
              min="1"
              max={eventDetails.ticketsavailable}
            />
          </div>

          <button onClick={handleBooking} disabled={loading}>
            {loading ? "Booking..." : "Book Now"}
          </button>
        </div>
      ) : (
        <p>Event details not found.</p>
      )}
    </div>
  );
};

export default BookTicket;
