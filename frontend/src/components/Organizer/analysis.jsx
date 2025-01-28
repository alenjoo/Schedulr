import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './analysis.css';
import { jwtDecode } from 'jwt-decode';

function Analysis() {
  const [ticketSales, setTicketSales] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [attendeeDemographics, setAttendeeDemographics] = useState([]);

  useEffect(() => {
    const fetchTicketSales = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const organizerId = decodedToken.id;

        const response = await axios.get('http://localhost:5001/ticket-sales', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            organizerId,
          },
        });

        setTicketSales(response.data);
      } catch (error) {
        console.error('Error fetching ticket sales:', error);
      }
    };

    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get(`http://localhost:5001/revenue/rev`, {
          params: { userId },
        });

        setRevenue(response.data);
      } catch (error) {
        console.error('Error fetching revenue:', error);
      }
    };

    const fetchDemographics = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get('http://localhost:5001/demographics/dem', {
          params: { userId },
        });
        setAttendeeDemographics(response.data);
      } catch (error) {
        console.error('Error fetching attendee demographics:', error);
      }
    };

    fetchTicketSales();
    fetchRevenue();
    fetchDemographics();
  }, []);

  return (
    <div className="analysis-container">
      <h2 className="analysis-title">Event Analysis</h2>

      <div className="analysis-sections">
        <div className="analysis-section">
          <h3 className="analysis-section-title">Ticket Sales by Time of Day</h3>
          <table className="analysis-table">
            <thead>
              <tr>
                <th>Time of Day</th>
                <th>Total Bookings</th>
              </tr>
            </thead>
            <tbody>
              {ticketSales.length > 0 ? (
                ticketSales.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.time_of_day}</td>
                    <td>{sale.total_bookings}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="analysis-empty">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="analysis-section">
          <h3 className="analysis-section-title">Revenue Generation</h3>
          <table className="analysis-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenue.length > 0 ? (
                revenue.map((event, index) => (
                  <tr key={index}>
                    <td>{event.title}</td>
                    <td>₹{event.total_revenue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="analysis-empty">
                    No revenue data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="analysis-section">
          <h3 className="analysis-section-title">Attendee Demographics</h3>
          {attendeeDemographics.length > 0 ? (
            <table className="analysis-table">
              <thead>
                <tr>
                  <th>Age Group</th>
                  <th>Number of Attendees</th>
                </tr>
              </thead>
              <tbody>
                {attendeeDemographics.map((demographic, index) => (
                  <tr key={index}>
                    <td>{demographic.ageGroup}</td>
                    <td>{demographic.attendeesCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="analysis-empty-message">No demographic data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analysis;
