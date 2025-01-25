const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');  
const add_eventRoutes=require('./routes/add_event');
const event_updateRoutes=require('./routes/event_update');
const edit_eventRoutes=require('./routes/edit_event');
const searchRoutes=require('./routes/search');

const app = express();

  
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/add-event',add_eventRoutes);
app.use('/get-events',event_updateRoutes);
app.use('/delete',event_updateRoutes);
app.use('/get-event',edit_eventRoutes);
app.use('/edit',edit_eventRoutes);
app.use('/search',searchRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
