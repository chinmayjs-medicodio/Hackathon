import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <span className="logo-icon">🚀</span> CampaignForge
            </h3>
            <p>AI-Powered Marketing Automation Platform for modern businesses.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="GitHub">GitHub</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/onboard">Client Onboarding</Link></li>
              <li><Link to="/content">Content Approval</Link></li>
              <li><Link to="/campaigns">Campaign Automation</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>AI Content Generation</li>
              <li>Multi-Platform Posting</li>
              <li>Analytics & Insights</li>
              <li>Campaign Management</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link to="/">About</Link></li>
              <li><Link to="/">Pricing</Link></li>
              <li><Link to="/">Contact</Link></li>
              <li><Link to="/">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 CampaignForge. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
