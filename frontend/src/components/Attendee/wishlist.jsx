import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Fix import syntax
import { useNavigate } from "react-router-dom";
import { FaHome, FaTicketAlt, FaStar } from "react-icons/fa"; // Icons for sidebar
import './tickets.css'; // Make sure to import the CSS for proper styling

const Wishlist = () => {
  const [wishlistEvents, setWishlistEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      // Decode token to get user_id
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      // Fetch wishlist with event details from the backend
      const response = await axios.get("http://localhost:5001/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in Authorization header
        },
        params: { user_id: userId },
      });

      if (response.data.success) {
        setWishlistEvents(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch wishlist.");
      }
    } catch (err) {
      setError("Failed to fetch wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (eventId) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      // Decode token to get user_id
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      // Send a delete request to the backend
      const response = await axios.delete("http://localhost:5001/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { user_id: userId, event_id: eventId }, // Pass both user_id and event_id in the request body
      });

      if (response.data.success) {
        alert("Event removed from wishlist!");
        // Update the state to remove the event
        setWishlistEvents((prev) =>
          prev.filter((event) => event.event_id !== eventId)
        );
      } else {
        alert(response.data.message || "Failed to remove event.");
      }
    } catch (err) {
      alert("Failed to remove event from wishlist.");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="attendee-container">
      {/* Static Sidebar */}
      <div className="attendee-sidebar">
        <div className="sidebar-menu">
          <ul>
            <li onClick={() => navigate("/attendee")}>
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

      {/* Main Content */}
      <div className="attendee-content">
        <div className="content-box">
          <h1 className="attendee-header">My Wishlist</h1>

          {loading && <div className="attendee-loading">Loading...</div>}
          {error && <div className="attendee-error">{error}</div>}

          {wishlistEvents.length > 0 ? (
            <div className="attendee-table-container">
              <table className="attendee-table">
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
                  {wishlistEvents.map((event) => (
                    <tr key={event.event_id}>
                      <td>{event.title}</td>
                      <td>{event.location}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.category}</td>
                      <td>{event.price}</td>
                      <td>{event.ticketsavailable}</td>
                      <td>
                      <button className="wish-remove-button" onClick={() => removeFromFavorites(event.event_id)}>
  Remove
</button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center">No events in your wishlist.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
