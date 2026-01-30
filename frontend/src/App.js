import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import { ToastProvider, useToastContext } from './context/ToastContext';
import HomePage from './pages/HomePage';
import ClientOnboarding from './pages/ClientOnboarding';
import ContentApproval from './pages/ContentApproval';
import Analytics from './pages/Analytics';
import CampaignAutomation from './pages/CampaignAutomation';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const { toasts, removeToast } = useToastContext();

  return (
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
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Router>
  );
}

export default App;
