const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const db = require("./config/db");
const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const add_eventRoutes = require("./routes/add_event");
const event_updateRoutes = require("./routes/event_update");
const edit_eventRoutes = require("./routes/edit_event");
const searchRoutes = require("./routes/search");
const { bookTicket } = require("./controllers/book");
const event_controlRoutes=require("./routes/eventController");
const wishlistROutes=require('./routes/wishlist');
const book_updateRoute=require("./routes/booked_data");
const paymentRoutes = require("./routes/payment"); 
const ticketControllerRoutes=require("./routes/ticketController");
const app = express();

const wss = new WebSocketServer({ port: 8080 }); 
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("close", () => clients.delete(ws));
});

const broadcast = (message) => {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/add-event", add_eventRoutes);
app.use("/get-events", event_updateRoutes);
app.use("/delete", event_updateRoutes);
app.use("/get-event", edit_eventRoutes);
app.use("/search", searchRoutes);
app.use("/my-events",event_controlRoutes);
app.post("/book", bookTicket(broadcast));
app.use("/cancel-booking",event_controlRoutes);
app.use('/add-favorite',wishlistROutes);
app.use('/remove-favorite',wishlistROutes);
app.use('/wishlist',wishlistROutes);
app.use('/booked-tickets',book_updateRoute);
app.use("/payment", paymentRoutes); 
app.use("/get-user",loginRoutes);
app.use("/ticket-sales",ticketControllerRoutes);
app.use("/revenue",ticketControllerRoutes);
app.use("/demographics",ticketControllerRoutes);
app.use("/edit",edit_eventRoutes);
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
