import React from "react";
import "../styles/Homepage.css";

function HomePage() {
  return (
    <div className="homepage-container">
    {/* Hero Section */}
    <header className="hero-section">
      <span className="logo" onClick={() => navigate("/")}>
        Bruce
      </span>
      <h1 className="hero-title">
        Ask Bruce. Take more cases and supercharge your existing team with an AI Legal Assistant.
      </h1>
      <p className="hero-description">
        Our AI Agent will perform routine tasks during the intake process for potential and current clients. 
        This saves you time and money. We integrate with Clio, Outlook, and other tools to meet you where you are.
      </p>
      <div className="button-container">
        <button className="primary-btn">Book a Demo</button>
        <button className="secondary-btn">Request Waitlist Access</button>
      </div>
    </header>

    {/* Assistant Features Section */}
    <section className="assistant-section">
      <h2>A 24/7 assistant that conducts all your most tiresome tasks</h2>
      <p>Check out our amazing features and experience the power of Bruce for yourself.</p>
      <button className="primary-btn">Book a Demo</button>
    </section>

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