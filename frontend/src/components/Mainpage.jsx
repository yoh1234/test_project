import React from "react";
import "../styles/Homepage.css";

function HomePage() {
  return (
    <div className="homepage-container">
      <header className="hero-section">
        <h1 className="hero-title">Welcome to AI Legal Assistant</h1>
        <p className="hero-description">
          Your intelligent partner for insightful research and smarter decisions.  
          Leverage the power of AI to simplify your research workflow, generate insights, and access information effortlessly.
        </p>

      </header>

      <section className="features-section">
        <h2>Why Choose Our AI Research Assistant?</h2>
        <ul className="features-list">
          <li>⚡ Get accurate and quick answers to research queries.</li>
          <li>📚 Generate well-organized research summaries and insights.</li>
          <li>🧠 Stay informed with AI-powered suggestions and recommendations.</li>
        </ul>
      </section>

      <section className="illustration-section">
        <div className="illustration-box">
          <p>✨ Imagine having a 24/7 virtual research assistant — that's us!</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;