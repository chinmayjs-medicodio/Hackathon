import React, { useState, useEffect } from 'react';
import './ProcessingPage.css';
import WorkflowProgress from '../components/WorkflowProgress';

const ProcessingPage = ({ 
  message = 'Processing your request...', 
  subMessage = 'Please wait while we generate your content',
  workflowStep = 'onboarding',
  completedSteps: propCompletedSteps = [],
  onStepChange = null
}) => {
  const [currentStep, setCurrentStep] = useState(workflowStep);
  const [completedSteps, setCompletedSteps] = useState(propCompletedSteps);

  useEffect(() => {
    setCurrentStep(workflowStep);
    setCompletedSteps(propCompletedSteps);
  }, [workflowStep, propCompletedSteps]);

  return (
    <div className="processing-page">
      <div className="processing-container">
        <WorkflowProgress 
          currentStep={currentStep} 
          completedSteps={completedSteps}
        />
        <div className="processing-animation">
          <div className="spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        </div>
        <div className="processing-content">
          <h2 className="processing-title">{message}</h2>
          <p className="processing-subtitle">{subMessage}</p>
          <div className="processing-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
