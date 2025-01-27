import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './analysis.css';

function Analysis() {
  const [ticketSales, setTicketSales] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [attendeeDemographics, setAttendeeDemographics] = useState([]);

  // Fetching ticket sales data
  useEffect(() => {
    const fetchTicketSales = async () => {
      try {
        const response = await axios.get('http://localhost:5001/ticket-sales');
        setTicketSales(response.data);
      } catch (error) {
        console.error('Error fetching ticket sales:', error);
      }
    };

    // Fetching revenue data
    const fetchRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:5001/revenue/hi');
        
        setRevenue(response.data);
        console.log(revenue)
      } catch (error) {
        console.error('Error fetching revenue:', error);
      }
    };

    fetchTicketSales();
    fetchRevenue();
  }, []);

  return (
    <div className="analysis-container">
      <h2>Event Analysis</h2>

      {/* Ticket Sales Section */}
      <div className="analysis-sections">
        <div className="section">
          <h3>Ticket Sales by Time of Day</h3>
          <table>
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
                  <td colSpan="2">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Revenue Generation Section */}
        <div className="section">
          <h3>Revenue Generation</h3>
          <table>
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
                  <td colSpan="2">No revenue data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Attendee Demographics Section */}
        <div className="section">
          <h3>Attendee Demographics</h3>
          {attendeeDemographics.length > 0 ? (
            <table>
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
            <p>No demographic data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analysis;
