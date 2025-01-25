import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/login';
import Signup from './components/Signup/signup';
import Home from './components/Home/home';
import Organizer from './components/Organizer/organizer';
import AddEvent from './components/Organizer/add_event';

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
      </Routes>
    </Router>
  );
}

export default App;
