import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/login', { email, password });
      console.log(response);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);

        const decodedToken = jwtDecode(response.data.token);
        const role = decodedToken.role;

        if (role === 'Admin') {
          navigate('/home');
        } else if (role === 'Organizer') {
          navigate('/organizer');
        } else if (role === 'Attendee') {
          navigate('/attendee');
        } else {
          navigate('/home'); 
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-input-group">
          <label className="login-label" htmlFor="email">Email</label>
          <input
            className="login-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-input-group">
          <label className="login-label" htmlFor="password">Password</label>
          <input
            className="login-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button className="login-button" type="submit">Login</button>
      </form>
      <div className="login-signup-link">
        <p className="login-text">Don't have an account? <a href="/signup" className="login-link">Sign Up</a></p>
      </div>
    </div>
  );
}

export default Login;
