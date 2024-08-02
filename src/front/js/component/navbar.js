import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoAutoAgenda from "../../img/autoagendalogo1080.png";
import '../../styles/navbar.css';

export const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const userRole = null; // Placeholder: replace with actual user role check ('client', 'mechanic', 'admin')

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src={logoAutoAgenda}
            className="mr-3 h-6 sm:h-9"
            alt="AutoAgenda Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold">
            AutoAgenda
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleNavCollapse}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/bookappointment" className="nav-link" onClick={handleNavCollapse}>
                Book an Appointment
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={handleNavCollapse}>
                Contact
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            {userRole === null && (
              <>
                <Link to="/login" className="btn btn-primary me-2" onClick={handleNavCollapse}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={handleNavCollapse}>
                  Signup
                </Link>
              </>
            )}
            {userRole === "client" && (
              <>
                <Link to="/userprofile" className="btn btn-secondary me-2" onClick={handleNavCollapse}>
                  Profile
                </Link>
                <Link to="/appointments" className="btn btn-secondary me-2" onClick={handleNavCollapse}>
                  Appointment History
                </Link>
                <Link to="/logout" className="btn btn-primary" onClick={handleNavCollapse}>
                  Logout
                </Link>
              </>
            )}
            {userRole === "mechanic" && (
              <>
                <Link to="/appointments" className="btn btn-secondary me-2" onClick={handleNavCollapse}>
                  Appointment History
                </Link>
                <Link to="/logout" className="btn btn-primary" onClick={handleNavCollapse}>
                  Logout
                </Link>
              </>
            )}
            {userRole === "admin" && (
              <>
                <Link to="/admindashboard" className="btn btn-secondary me-2" onClick={handleNavCollapse}>
                  Dashboard
                </Link>
                <Link to="/appointments" className="btn btn-secondary me-2" onClick={handleNavCollapse}>
                  Appointment History
                </Link>
                <Link to="/logout" className="btn btn-primary" onClick={handleNavCollapse}>
                  Logout
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
