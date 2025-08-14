import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark p-3 w-100">
      <div className="container d-flex justify-content-between">
        <Link className="navbar-brand" to="/">BLOGGERS</Link>

        <div className="navbar-nav gap-3 align-items-center">
          {user ? (
            <>
              {user.isAdmin ? (
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              ) : (
                <>
                  <Link className="nav-link" to="/blogs">Blogs</Link>
                  <Link className="nav-link" to="/profile">Profile</Link>
                </>
              )}

              <button onClick={handleLogout} className="btn btn-sm btn-outline-light ms-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/">Blogs</Link>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
