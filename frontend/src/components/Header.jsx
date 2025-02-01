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
          <button className="nav-btn" onClick={handleSignOut}>Sign Out</button>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;