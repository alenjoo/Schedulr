import React from 'react';
import { useNavigate } from 'react-router-dom';
import './organizer.css';
import { FaPlus, FaChartBar, FaCheckCircle } from 'react-icons/fa';

function Organizer() {
  const navigate = useNavigate();

  const handleAddEvent = () => {
    navigate('/add-event'); 
  };

  const handleCheckEventStatus = () => {
    navigate('/check-event-status');
  };

  const handleAnalysis = () => {
    navigate('/analysis');
  };

  return (
    <div className="organizer-container">
      <div className="organizer-card">
        <h2 className="organizer-title">Organizer Dashboard</h2>
        
        <div className="organizer-options">
          <button className="organizer-button" onClick={handleAddEvent}>
            <FaPlus className="icon" /> Add Event
          </button>
          <button className="organizer-button" onClick={handleCheckEventStatus}>
            <FaCheckCircle className="icon" /> Check Event Status
          </button>
          <button className="organizer-button" onClick={handleAnalysis}>
            <FaChartBar className="icon" /> Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

export default Organizer;
