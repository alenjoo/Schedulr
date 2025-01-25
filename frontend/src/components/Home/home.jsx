import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="welcome-message">
        <h2>Welcome, </h2>
        <p>You have successfully logged in.</p>
      </div>
      <p>Loading...</p>
    </div>
  );
}

export default Home;
