require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");
const util = require("util");
const queryAsync = util.promisify(pool.query).bind(pool);
require('dotenv').config()
const router = express.Router();

router.post("/orders/:totalprice", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { totalprice } = req.params;
    const options = {
      amount: totalprice * 100, 
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occurred while creating the order");

    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/success", async (req, res) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        user_id, // Assuming you are passing user_id from frontend
        event_id, // Assuming you are passing event_id from frontend
        amount, // Amount paid
        num_tickets, // Number of tickets booked
      } = req.body;
  
      const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
  
      const digest = shasum.digest("hex");
  
      if (digest !== razorpaySignature) {
        return res.status(400).json({ msg: "Transaction not legit!" });
      }
  
      const paymentStatus = "success"; 
      const query = `
        INSERT INTO payments (user_id, event_id, amount, num_tickets, payment_status)
        VALUES (?, ?, ?, ?, ?)
      `;
  
      const values = [user_id, event_id, amount, num_tickets, paymentStatus];
  
      await pool.query(query, values); 
  
  
      res.json({
        msg: "Payment successful and booking completed!",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      });
    } catch (error) {
      console.error("Error verifying payment signature:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
  module.exports = router;