import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import './book.css';

const BookTicket = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`http://localhost:5001/get-event/${eventId}`);
        setEventDetails(response.data);
        setTotalPrice(response.data.price); // Set initial total price based on one ticket
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

  useEffect(() => {
    if (eventDetails) {
      setTotalPrice(ticketCount * eventDetails.price);
    }
  }, [ticketCount, eventDetails]);

  const handleTicketChange = (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value, 10), 1), eventDetails.ticketsavailable);
    setTicketCount(value);
  };

  const handleBooking = async () => {
    // Only proceed if the payment has returned success
    await displayRazorpay(); // This triggers the Razorpay payment flow
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post(`http://localhost:5001/payment/orders/${totalPrice}`);

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;
    const response = await axios.get(`http://localhost:5001/get-event/${eventId}`);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in.");
      navigate("/login");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    const userdetails = await axios.get(`http://localhost:5001/get-user/${userId}`);
    const userdetails2 = userdetails.data;

    const options = {
      key: "rzp_test_NsB3oPpNOVdgRa", 
      amount: (totalPrice * 100).toString(), // Convert totalPrice to paise
      currency: "INR",
      name: userdetails2.userDetails.name,
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          user_id: userId, 
          event_id: eventId, 
          amount: totalPrice, 
          num_tickets: ticketCount, 
        };
      
        const paymentVerificationResponse = await axios.post("http://localhost:5001/payment/success", data);
      
        if (paymentVerificationResponse.data.msg === "Payment successful and booking completed!") {
          
          const bookingResponse = await axios.post("http://localhost:5001/book", {
            event_id: eventId,
            tickets: ticketCount,
            user_id: userId,
          });

      
          const { success, message } = bookingResponse.data;
          console.log(bookingResponse.data)
          if (success) {
            alert(message || "Tickets booked successfully!");
            navigate("/attendee"); // Redirect to the attendee page
          } else {
            alert(message || "Failed to book tickets. Please try again.");
          }
        } else {
          alert("Payment failed. Please try again.");
        }
      
      
      },
      prefill: {
        name: userdetails2.userDetails.name,
        email: userdetails2.userDetails.email,
        contact: userdetails2.userDetails.contact,
      },
      notes: {
        address: "",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  if (loading) return <div className="book-loading">Loading...</div>;
  if (error) return <div className="book-error">{error}</div>;

  if (!eventDetails && !loading && !error) {
    navigate("/events");
    return null;
  }

  return (
    <div className="book-container">
      <h1 className="book-header">Book Ticket</h1>
      {eventDetails ? (
        <div className="book-event-details">
          <h2 className="book-subheader">{eventDetails.title}</h2>
          <p><strong>Location:</strong> {eventDetails.location}</p>
          <p><strong>Date:</strong> {new Date(eventDetails.date).toLocaleDateString()}</p>
          <p><strong>Category:</strong> {eventDetails.category}</p>
          <p><strong>Price per Ticket:</strong> ₹{eventDetails.price}</p>
          <p><strong>Tickets Available:</strong> {eventDetails.ticketsavailable}</p>

          <div className="book-ticket-count-section">
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

          <p className="book-total-price"><strong>Total Price:</strong> ₹{totalPrice}</p>

          <button className="book-button" onClick={handleBooking} disabled={loading}>
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
