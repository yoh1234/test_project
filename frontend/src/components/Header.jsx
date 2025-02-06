import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";

import { ACCESS_TOKEN } from "../constants";


const Header = () => {

  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN);
  
  const handleSignOut = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    navigate("/");
  };

  return (
    <header className="header">
      <span className="logo" onClick={() => navigate("/")}>Bruce</span>
      <nav>
        {isAuthenticated ? (
          <div>
            <Link to="/dashboard">
              <button className="nav-btn">Dashboard</button>
            </Link>
            <button className="nav-btn" onClick={handleSignOut}>Sign Out</button>
          </div>) : (
          <>
            {/* <Link to="/login" className="nav-btn">Login</Link> */}
            <Link to="/login">
              <button className="nav-btn">Login</button>
            </Link>
            <a href="https://calendly.com/onwardjusticemeeting/meet-daniel-1" target="_blank" rel="noopener noreferrer">
              <button className="nav-btn">Book a Demo</button>
            </a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;