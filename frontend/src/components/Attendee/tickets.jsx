import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaHome, FaTicketAlt, FaStar } from "react-icons/fa";
import './tickets.css';

const ViewBookedTickets = () => {
  const [bookedTickets, setBookedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookedTickets = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("User is not authenticated. Please log in.");
          return;
        }

        // Decode the token to extract user_id
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get("http://localhost:5001/booked-tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { user_id: userId },
        });

        if (response.data.success) {
          setBookedTickets(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch booked tickets.");
        }
      } catch (err) {
        setError("Failed to fetch booked tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedTickets();
  }, []);

  return (
    <div className="attendee-container">
      {/* Sidebar */}
      <div className="attendee-sidebar">
        <div className="sidebar-menu">
          <ul>
            <li onClick={() => navigate("/attendee")}>
              <FaHome className="sidebar-icon" /> Home
            </li>
            <li onClick={() => navigate("/view-booked-tickets")}>
              <FaTicketAlt className="sidebar-icon" /> Booked Tickets
            </li>
            <li onClick={() => navigate("/wishlist")}>
              <FaStar className="sidebar-icon" /> Wishlist
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="attendee-content">
        {/* Header */}
        <div className="ticket-header">
          <h1>Booked Tickets</h1>
        </div>

        {/* Table for Booked Tickets */}
        <div className="ticket-wrapper">
          <table className="attendee-table">
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
              {bookedTickets.length > 0 ? (
                bookedTickets.map((ticket) => (
                  <tr key={ticket.event_id}>
                    <td>{ticket.title}</td>
                    <td>{ticket.location}</td>
                    <td>{new Date(ticket.date).toLocaleDateString()}</td>
                    <td>{ticket.category}</td>
                    <td>₹{ticket.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="ticket-no-tickets">
                    No booked tickets
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewBookedTickets;
