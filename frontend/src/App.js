import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ClientOnboarding from './pages/ClientOnboarding';
import ContentApproval from './pages/ContentApproval';
import Analytics from './pages/Analytics';
import CampaignAutomation from './pages/CampaignAutomation';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/onboard" element={<ClientOnboarding />} />
            <Route path="/content" element={<ContentApproval />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/campaigns" element={<CampaignAutomation />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
