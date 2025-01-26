import React, { useState, useEffect } from "react";
import axios from "axios";
import{ jwtDecode} from "jwt-decode"; // Fix import syntax
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>My Wishlist</h1>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {wishlistEvents.length > 0 ? (
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
            {wishlistEvents.map((event) => (
              <tr key={event.event_id}>
                <td>{event.title}</td>
                <td>{event.location}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.category}</td>
                <td>{event.price}</td>
                <td>{event.ticketsavailable}</td>
                <td>
                  <button onClick={() => removeFromFavorites(event.event_id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No events in your wishlist.</div>
      )}
    </div>
  );
};

export default Wishlist;
