import React, { useEffect, useState } from 'react';
import { fetchCurrentProblem } from '../../api/problemApi';
import { fetchRecentSubmissions } from '../../api/submissionApi';
import { useNavigate } from 'react-router-dom';
import './CurrentProblemCard.css';

function CurrentProblemCard() {
  const navigate = useNavigate();
  const [currentProblem, setCurrentProblem] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [timeSpent, setTimeSpent] = useState('00:00:00');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCurrentProblemData = async () => {
      try {
        setLoading(true);
        
        // Get the user ID from localStorage
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        if (!user || !user.id) {
          setError('User not found');
          setLoading(false);
          return;
        }

        // Fetch current problem and recent submissions in parallel
        const [problemData, submissions] = await Promise.all([
          fetchCurrentProblem(),
          fetchRecentSubmissions(user.id)
        ]);

        // Current problem data loaded
        // Recent submissions loaded

        setCurrentProblem(problemData);

        // Find the submission for the current problem
        if (submissions && submissions.length > 0) {
          const currentProblemSubmission = submissions.find(
            submission => submission.problem && submission.problem.id === problemData.id
          );
          
          if (currentProblemSubmission) {
            // Found submission for current problem
            // Submission status checked
            setSubmissionData(currentProblemSubmission);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching current problem data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    getCurrentProblemData();
  }, []);

  // Live timer effect that only runs when user is on the problem page
  useEffect(() => {
    if (!currentProblem) return;

    const updateTimer = () => {
      const startTimeKey = `problem_${currentProblem.id}_start`;
      const startTime = localStorage.getItem(startTimeKey);
      
      if (startTime) {
        // User is currently on the problem page - show live timer
        const start = parseInt(startTime);
        const now = Date.now();
        const diffInMs = now - start;
        
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffInSeconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
        
        const liveTime = `${diffInHours.toString().padStart(2, '0')}:${diffInMinutes.toString().padStart(2, '0')}:${diffInSeconds.toString().padStart(2, '0')}`;
        setTimeSpent(liveTime);
      } else {
        // User is not on the problem page - show time from last submission
        if (submissionData && submissionData.timeSpent) {
          const totalSeconds = submissionData.timeSpent;
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          
          const staticTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          setTimeSpent(staticTime);
        } else {
          setTimeSpent('00:00:00');
        }
      }
    };

    // Update timer immediately
    updateTimer();

    // Set up interval for live updates (only when user is on problem page)
    const startTimeKey = `problem_${currentProblem.id}_start`;
    const startTime = localStorage.getItem(startTimeKey);
    
    let interval;
    if (startTime) {
      // User is on problem page - update timer every second
      interval = setInterval(updateTimer, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentProblem, submissionData]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY':
        return '#558957';
      case 'MEDIUM':
        return '#C7A925';
      case 'HARD':
        return '#FF6B6B';
      default:
        return '#C7A925';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'PASSED':
        return 'Completed';
      case 'PARTIAL':
        return 'In Progress';
      case 'FAILED':
        return 'In Progress';
      case 'ERROR':
        return 'In Progress';
      default:
        return 'In Progress';
    }
  };

  if (loading) {
    return (
      <div className="current-problem-card">
        <h3>Current Challenge</h3>
        <div className="loading-placeholder">
          <div className="loading-line"></div>
          <div className="loading-line"></div>
          <div className="loading-line"></div>
        </div>
      </div>
    );
  }

  if (error || !currentProblem) {
    return (
      <div className="current-problem-card">
        <h3>Current Challenge</h3>
        <p>No current problem available.</p>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  const handleResumeProblem = () => {
    navigate(`/problem/${currentProblem.id}`);
  };

  const difficultyColor = getDifficultyColor(currentProblem.difficulty);
  const statusText = submissionData ? getStatusText(submissionData.result) : 'Not Started';

  return (
    <div className="current-problem-card">
      <h3>Current Challenge</h3>
      <div className="problem-info">
        <div className="title-difficulty-row">
          <h4 className="problem-title">{currentProblem.title}</h4>
          <div 
            className="difficulty-indicator" 
            style={{ backgroundColor: difficultyColor }}
          ></div>
        </div>
        <div className="status-time-row">
          <span className="status">
            Status: {statusText}
          </span>
          <span className="time-spent">Time Spent: {timeSpent}</span>
        </div>
        <p className="problem-description">
          {currentProblem.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum bibendum augue urna, id molestie tortor.'}
        </p>
      </div>
      <button className='resume-button' onClick={handleResumeProblem}>
        Resume
      </button>
    </div>
  );
}

export default CurrentProblemCard;
