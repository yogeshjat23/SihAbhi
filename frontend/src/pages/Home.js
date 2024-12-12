import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation
import "./Home.css";
import motor_img from "../assets/motor.png";




function Home() {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <h1>Motor Monitoring System</h1>
        </div>
        <div className="main-navbar">
        <ul className=" nav-links">
          <li>
            <Link to="/" style={{ color: "#000", textDecoration: "none" }}>Home</Link>
          </li>
          <li>
            <Link to="/motor" style={{ color: "#000", textDecoration: "none" }}>Motor</Link> {/* Link to Homepage */}
          </li>
        </ul></div>
        <Link to="/sign-in">
        <button className="sign-in">Sign In</button></Link>
      </nav>

      {/* Main Section */}
      <div className="main-section">
        <div className="text-content">
          <h2>
            Let's Make <br /> <span className="highlight">Motor Monitoring </span>
            <br />an easier task.
          </h2>
          <button className="get-started">Get Started →</button>
        </div>
        <div className="image-content">
          <img
            src={motor_img}
            alt="motor-img"
            className="motor-img"
          />
        </div>
      </div>

      <footer className="footer">
        <p>
          Designed and Developed by <strong>Team Voltaces</strong>
        </p>
      </footer>
    </div>
  );
}

export default Home;
