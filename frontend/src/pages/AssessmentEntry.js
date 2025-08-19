import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '../components/Dashboard/HeaderBar';
import axios from '../api/axios';
import './AssessmentEntry.css';

function AssessmentEntry() {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !user.id) {
    return <div>Please log in to access assessments.</div>;
  }

  const handleStartAssessment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('assessment/start', {
        accessCode: accessCode,
        candidateEmail: user.email
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Store assessment session data
      localStorage.setItem('assessmentSession', JSON.stringify({
        sessionId: response.data.sessionId,
        timeLimit: response.data.timeLimit,
        problems: response.data.problems,
        startTime: Date.now()
      }));

      // Navigate to assessment page
      navigate('/assessment-solving');
    } catch (error) {
      console.error('Error starting assessment:', error);
      if (error.response?.status === 404) {
        setError('Invalid assessment code. Please check and try again.');
      } else if (error.response?.status === 400) {
        setError('You have already started this assessment.');
      } else {
        setError('Failed to start assessment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/candidateDashboard');
  };

  return (
    <div className='assessment-entry-root'>
      <HeaderBar
        user={user}
        customTitle="Start Assessment"
        customSubtitle="Enter your assessment code to begin"
        onBack={handleBack}
      />
      <div className='assessment-entry-content'>
        <div className='entry-grid'>
          <div className='entry-card guidelines-card'>
            <div className='card-header'>
              <h2>Assessment Guidelines</h2>
              <p>Important information before you begin</p>
            </div>
            
            <div className='guidelines-content'>
              <div className='guideline-item'>
                <span className='guideline-icon'>⚠️</span>
                <div className='guideline-text'>
                  <strong>One-time access:</strong> You can only start an assessment once
                </div>
              </div>
              
              <div className='guideline-item'>
                <span className='guideline-icon'>🧪</span>
                <div className='guideline-text'>
                  <strong>Test your code:</strong> You can run your code to test it during the assessment
                </div>
              </div>
              
              <div className='guideline-item'>
                <span className='guideline-icon'>📤</span>
                <div className='guideline-text'>
                  <strong>Single submission:</strong> You can only submit once when you're ready to finish
                </div>
              </div>
              
              <div className='guideline-item'>
                <span className='guideline-icon'>⏰</span>
                <div className='guideline-text'>
                  <strong>Time limit:</strong> The assessment will automatically submit when time runs out
                </div>
              </div>
              
              <div className='guideline-item'>
                <span className='guideline-icon'>🌐</span>
                <div className='guideline-text'>
                  <strong>Internet connection:</strong> Make sure you have a stable internet connection
                </div>
              </div>
            </div>
          </div>
          
          <div className='vertical-divider'></div>
          
          <div className='entry-card form-card'>
            <div className='card-header'>
              <h2>Assessment Code</h2>
              <p>Enter the assessment code provided by your administrator</p>
            </div>
            
            <form onSubmit={handleStartAssessment} className='entry-form'>
              <div className='form-group'>
                <label htmlFor='accessCode'>Assessment Code</label>
                <input
                  type='text'
                  id='accessCode'
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder='Enter assessment code...'
                  required
                  className='code-input'
                />
              </div>
              
              {error && (
                <div className='error-message'>
                  {error}
                </div>
              )}
              
              <button
                type='submit'
                className='start-assessment-btn'
                disabled={loading || !accessCode.trim()}
              >
                {loading ? 'Starting Assessment...' : 'Start Assessment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentEntry; 