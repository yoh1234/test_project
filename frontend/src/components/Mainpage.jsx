import React from "react";
import "../styles/Homepage.css";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="homepage-container">
    {/* Hero Section */}
    <header className="hero-section">

      <div className="rounded-badge">
        Currently Taking Select Firms and Attorneys
    </div>
      <h1 className="hero-title">
        <p>
        Ask Bruce.<br />Take more cases and supercharge your<br />existing team with a<br />AI Legal Assistant.
        </p>
      </h1>
      <p className="hero-description">
        Our AI Agent will perform routine tasks during the intake process <br />for potential and current clients that you
        or your staff normally <br /> conduct. This saves you time and money. We integrate with Clio, <br />Outlook, and other tools and meet you where you are.
      </p>
      <div className="button-container">
        <a href="https://calendly.com/onwardjusticemeeting/meet-daniel-1" target="_blank" rel="noopener noreferrer">
          <button className="primary-btn">Book a Demo</button>
        </a>
        <Link to="/register">
        <button className="secondary-btn">Request Access</button>
        </Link>
      </div>
    </header>

    {/* Assistant Features Section */}
    <section className="assistant-section">
      <h2>A 24/7 assistant that <br />conducts all your  <br />most tiresome tasks</h2>
      <p>Check out our amazing features and experience the <br />power of Bruce for yourself.</p>
      
    </section>
    <div className="wrapper">
    <section className="hero-section-2">
        <h1>Game changing analytics, <br /> customer insights and  <br /> workflow.</h1>
        <a href="https://calendly.com/onwardjusticemeeting/meet-daniel-1" target="_blank" rel="noopener noreferrer">
        <button className="primary-btn">Book a Demo</button>
        </a>
    </section>
    </div>
    {/* Footer */}
    <footer className="footer-section">
      <div className="footer-content">
        <div className="contact-info">
          <h3>Contact</h3>
          <p>daniel@onwardjustice.com</p>
          <p>Help: help@vaultflow.com</p>
          <p>New Business: partnership@onwardjustice.com</p>
        </div>
        <div className="social-links">
          <h3>Social</h3>
          <p>Instagram</p>
          <p>LinkedIn</p>
          <p>YouTube</p>
        </div>
      </div>
      <p>© 2025 Onward Justice. All Rights Reserved</p>
    </footer>
  </div>
    // <div className="homepage-container">
    //   <header className="hero-section">
    //     <h1 className="hero-title">Welcome to AI Legal Assistant</h1>
    //     <p className="hero-description">
    //       Your intelligent partner for insightful research and smarter decisions.  
    //       Leverage the power of AI to simplify your research workflow, generate insights, and access information effortlessly.
    //     </p>

    //   </header>

    //   <section className="features-section">
    //     <h2>Why Choose Our AI Research Assistant?</h2>
    //     <ul className="features-list">
    //       <li>⚡ Get accurate and quick answers to research queries.</li>
    //       <li>📚 Generate well-organized research summaries and insights.</li>
    //       <li>🧠 Stay informed with AI-powered suggestions and recommendations.</li>
    //     </ul>
    //   </section>

    //   <section className="illustration-section">
    //     <div className="illustration-box">
    //       <p>✨ Imagine having a 24/7 virtual research assistant — that's us!</p>
    //     </div>
    //   </section>
    // </div>
  );
}

export default HomePage;