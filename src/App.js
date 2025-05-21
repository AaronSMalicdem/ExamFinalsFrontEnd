import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/Wishlist';
import './styles.css';
import { FiLogOut } from 'react-icons/fi';

function Navbar() {
  const { user, logout } = React.useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
      navigate('/login');
    }
  };

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav>
      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          {user.role === 'customer' && <Link to="/wishlist">Wishlist</Link>}
          <Link to={user.role === 'admin' ? '/admin' : '/customer'}>Dashboard</Link>

          <button
            onClick={handleLogout}
            title="Logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <FiLogOut size={20} color="red" />
          </button>
        </>
      )}
    </nav>
  );
}




function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/" element={<CustomerDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;