import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../index.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="nav-container">
        <Link className="logo" to="/">
          BLOGSPHERE
        </Link>
        <ul className="nav-links">
          {user ? (
            <>
              {user.isAdmin ? (
                <Link to="/dashboard">Dashboard</Link>
              ) : (
                <>
                  <Link to="/blogs">Blogs</Link>
                  <Link to="/profile">Profile</Link>
                </>
              )}
              {/* You can style this button to look like a link or a distinct button */}
              <button onClick={handleLogout} className="login-button" style={{
                // Inline styles to make the button look like a link
                width: 'auto',
                padding: '0.5rem 1rem',
                fontSize: '0.95rem',
                background: 'none',
                color: '#5d4037',
                border: 'none',
                fontWeight: 500,
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/">Blogs</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;