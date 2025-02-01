import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register"

const MainContent = () => {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<p>Chat and match with top lawyers that speak your language. For Free.</p>} />
      </Routes>
    </main>
  );
};

export default MainContent;