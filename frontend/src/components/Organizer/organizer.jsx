import React from 'react';
import { useNavigate } from 'react-router-dom';
import './organizer.css';

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
      <h2 className="organizer-title">Organizer Dashboard</h2>
      
      <div className="organizer-options">
        <button className="organizer-button" onClick={handleAddEvent}>
          Add Event
        </button>
        <button className="organizer-button" onClick={handleCheckEventStatus}>
          Check Event Status
        </button>
        <button className="organizer-button" onClick={handleAnalysis}>
          Analysis
        </button>
      </div>
    </div>
  );
}

export default Organizer;
