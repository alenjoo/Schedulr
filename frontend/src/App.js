import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/login';
import Signup from './components/Signup/signup';
import Home from './components/Home/home';
import Organizer from './components/Organizer/organizer';
import AddEvent from './components/Organizer/add_event';
import CheckEvents from './components/Organizer/check_event';
import EditEvent from './components/Organizer/edit-event';
import Attendee from './components/Attendee/attendee';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/organizer" element={<Organizer />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path ="/check-event-status" element={<CheckEvents />} />
        <Route path="/edit-event/:event_id" element={<EditEvent />} />
        <Route path="/attendee" element={<Attendee />} />

      </Routes>
    </Router>
  );
}

export default App;
