import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const ViewBookedTickets = () => {
  const [bookedTickets, setBookedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookedTickets = async () => {
      setLoading(true);
      setError("");

      try {
        // Get the token from localStorage
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
          params: { user_id: userId }, // Pass user_id as query parameter
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
    <div>
      <h1>Booked Tickets</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
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
          {bookedTickets.length > 0 ? (
            bookedTickets.map((ticket) => (
              <tr key={ticket.event_id}>
                <td>{ticket.title}</td>
                <td>{ticket.location}</td>
                <td>{new Date(ticket.date).toLocaleDateString()}</td>
                <td>{ticket.category}</td>
                <td>{ticket.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No booked tickets</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewBookedTickets;
