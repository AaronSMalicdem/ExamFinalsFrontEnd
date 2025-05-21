import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- Import Link
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password,
      });
      login(response.data.token, response.data.role);
      navigate('/customer');
    } catch (err) {
      setError(err.response?.data?.errors || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{JSON.stringify(error)}</div>}
          <button type="submit">Register</button>
        </form>

        {/* Add login link here */}
        <p style={{ marginTop: '10px' }}>
          Already registered? <Link to="/login">Login.</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
