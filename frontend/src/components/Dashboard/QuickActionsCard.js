import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuickActionsCard.css';

function QuickActionsCard() {
  const navigate = useNavigate();

  const handleViewAllChallenges = () => {
    // Navigate to problems list
    navigate('/view-all-problems');
  };

  const handleStartPracticeMode = () => {
    // Navigate to practice mode
    navigate('/practice');
  };

  const handleStartAssessment = () => {
    // Navigate to assessment
    navigate('/assessment');
  };

  return (
    <div className="quick-actions-card">
      <h3>Quick Actions</h3>
      <div className="quick-actions-list">
        <button 
          className="quick-action-button"
          onClick={handleViewAllChallenges}
        >
          View All Challenges
        </button>
        <button 
          className="quick-action-button"
          onClick={handleStartPracticeMode}
        >
          Start Practice Mode
        </button>
        <button 
          className="quick-action-button"
          onClick={handleStartAssessment}
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
}

export default QuickActionsCard;
