import React from 'react';
import './WorkflowProgress.css';

const WorkflowProgress = ({ currentStep, completedSteps = [] }) => {
  const steps = [
    { id: 'onboarding', label: 'Client Onboarding', icon: '👤' },
    { id: 'generating', label: 'Generating Content', icon: '🤖' },
    { id: 'approval', label: 'Content Approval', icon: '✅' },
    { id: 'posting', label: 'Posting Content', icon: '📤' }
  ];

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) {
      return 'completed';
    }
    if (currentStep === stepId) {
      return 'active';
    }
    if (steps.findIndex(s => s.id === stepId) < steps.findIndex(s => s.id === currentStep)) {
      return 'completed';
    }
    return 'pending';
  };

  return (
    <div className="workflow-progress">
      <div className="workflow-header">
        <h3>Workflow Progress</h3>
      </div>
      <div className="workflow-steps">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={step.id}>
              <div className={`workflow-step ${status}`}>
                <div className={`step-circle ${status}`}>
                  {status === 'completed' ? (
                    <span className="step-check">✓</span>
                  ) : (
                    <span className="step-icon">{step.icon}</span>
                  )}
                </div>
                <div className="step-label">{step.label}</div>
                {status === 'active' && (
                  <div className="step-pulse"></div>
                )}
              </div>
              {!isLast && (
                <div className={`workflow-line ${status === 'completed' || status === 'active' ? 'completed' : 'pending'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowProgress;
