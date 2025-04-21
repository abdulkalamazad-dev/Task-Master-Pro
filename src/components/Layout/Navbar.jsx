import { Link, useLocation } from "react-router-dom";
import { FaSun, FaMoon, FaPlus, FaHome, FaUser } from "react-icons/fa";

function Navbar({ darkMode, toggleDarkMode }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          TaskMaster
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            aria-label="Home"
          >
            <FaHome />
          </Link>
          
          <Link 
            to="/add" 
            className={`navbar-link ${location.pathname === '/add' ? 'active' : ''}`}
            aria-label="Add Task"
          >
            <FaPlus />
          </Link>
          
          <Link 
            to="/profile" 
            className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
            aria-label="Profile"
          >
            <FaUser />
          </Link>
          
          <button 
            className="dark-mode-toggle" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
