import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import HeaderBar from '../components/Dashboard/HeaderBar';
import axios from '../api/axios';
import './AssessmentSolving.css';

function AssessmentSolving() {
  const navigate = useNavigate();
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python3');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Initialize assessment session from localStorage
    const sessionData = localStorage.getItem('assessmentSession');
    if (!sessionData) {
      navigate('/assessment');
      return;
    }

    const session = JSON.parse(sessionData);
    setProblems(session.problems);
    setSessionId(session.sessionId);
    setTimeLimit(session.timeLimit * 60); // Convert to seconds
    setTimeRemaining(session.timeLimit * 60);
    
    // Calculate remaining time based on session start time
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    const remaining = Math.max(0, session.timeLimit * 60 - elapsed);
    setTimeRemaining(remaining);
    
    if (remaining > 0) {
      startTimer();
    } else {
      // Time expired, auto-submit assessment
      handleAutoSubmit();
    }

    return () => {
      stopTimer();
    };
  }, [navigate]);

  useEffect(() => {
    if (problems.length > 0) {
      setCurrentProblem(problems[currentProblemIndex]);
      // Load saved code for current problem or initialize empty
      const savedCode = localStorage.getItem(`assessment_${sessionId}_problem_${currentProblemIndex}`);
      if (savedCode) {
        setCode(savedCode);
      } else {
        setCode('');
      }
      setResults(null);
    }
  }, [currentProblemIndex, problems, sessionId]);

  const startTimer = () => {
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRun = async () => {
    if (!currentProblem) return;

    setLoading(true);
    try {
      const response = await axios.post('candidate/submissions', {
        problemId: currentProblem.id,
        code: code,
        language: language,
        runOnly: true
      });

      setResults(response.data);
    } catch (error) {
      console.error('Error running code:', error);
      setResults({ output: 'Error: ' + (error.response?.data?.message || error.message) });
    } finally {
      setLoading(false);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      // Persist current code before navigating
      localStorage.setItem(`assessment_${sessionId}_problem_${currentProblemIndex}`, code);
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  };

  const handlePrevProblem = () => {
    if (currentProblemIndex > 0) {
      // Persist current code before navigating
      localStorage.setItem(`assessment_${sessionId}_problem_${currentProblemIndex}`, code);
      setCurrentProblemIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setSubmitted(true);
    stopTimer();
    
    try {
      // Evaluate all problems and calculate final score
      let totalScore = 0;
      let totalProblems = problems.length;
      
      for (let i = 0; i < problems.length; i++) {
        const savedCode = localStorage.getItem(`assessment_${sessionId}_problem_${i}`);
        if (savedCode) {
          try {
            const response = await axios.post('candidate/submissions', {
              code: savedCode,
              language: language,
              problemId: problems[i].id,
              runOnly: false
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (response.data.passedTests === response.data.totalTests) {
              totalScore += 100;
            }
          } catch (error) {
            console.error(`Error evaluating problem ${i}:`, error);
          }
        }
      }
      
      const finalScore = Math.round(totalScore / totalProblems);
      
      // Submit final score to backend
      await axios.post('assessment/submit', {
        sessionId: sessionId,
        score: finalScore
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Clean up assessment data
      localStorage.removeItem('assessmentSession');
      for (let i = 0; i < problems.length; i++) {
        localStorage.removeItem(`assessment_${sessionId}_problem_${i}`);
      }
      
      navigate('/candidateDashboard');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setSubmitted(false);
    }
  };

  const handleAutoSubmit = async () => {
    stopTimer();
    setSubmitted(true);
    
    try {
      // Evaluate all problems and calculate final score
      let totalScore = 0;
      let totalProblems = problems.length;
      
      for (let i = 0; i < problems.length; i++) {
        const savedCode = localStorage.getItem(`assessment_${sessionId}_problem_${i}`);
        if (savedCode) {
          try {
            const response = await axios.post('candidate/submissions', {
              code: savedCode,
              language: language,
              problemId: problems[i].id,
              runOnly: false
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (response.data.passedTests === response.data.totalTests) {
              totalScore += 100;
            }
          } catch (error) {
            console.error(`Error evaluating problem ${i}:`, error);
          }
        }
      }
      
      const finalScore = Math.round(totalScore / totalProblems);
      
      // Submit final score to backend
      await axios.post('assessment/submit', {
        sessionId: sessionId,
        score: finalScore
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Clean up assessment data
      localStorage.removeItem('assessmentSession');
      for (let i = 0; i < problems.length; i++) {
        localStorage.removeItem(`assessment_${sessionId}_problem_${i}`);
      }
      
      navigate('/candidateDashboard');
    } catch (error) {
      console.error('Error auto-submitting assessment:', error);
      setSubmitted(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return '#558957';
      case 'MEDIUM': return '#C7A925';
      case 'HARD': return '#FF6B6B';
      default: return '#6c757d';
    }
  };

  const parseResults = (results) => {
    if (!results) return null;
    
    // Parse test case results for display
    const testCases = results.testCases || [];
    const passedTests = testCases.filter(tc => tc.passed).length;
    const totalTests = testCases.length;
    
    return {
      passedTests,
      totalTests,
      output: results.output || '',
      error: results.error || '',
      testCases
    };
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      stopTimer();
      localStorage.removeItem('assessmentSession');
      for (let i = 0; i < problems.length; i++) {
        localStorage.removeItem(`assessment_${sessionId}_problem_${i}`);
      }
      navigate('/candidateDashboard');
    }
  };

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !user.id) {
    return <div>Please log in to access assessments.</div>;
  }

  if (!currentProblem) {
    return <div>Loading assessment...</div>;
  }

  const parsedResults = parseResults(results);

  return (
    <div className="problem-root">
      <div className="header-bar">
        <div className="left">
          <h1>BA</h1>
        </div>
        <div className="center">
          <h2>Assessment in Progress - Problem {currentProblemIndex + 1} of {problems.length}</h2>
          <div className={`header-timer-tagline ${timeRemaining < 300 ? 'warning' : ''}`}>
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        </div>
        <div className="right">
          <button className="logout-btn" onClick={handleExit}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Exit</span>
          </button>
        </div>
      </div>
      <div className="problem-content">
        <div className="problem-left-panel">
          <div className="problem-title-section">
            <h2 className="problem-title">{currentProblem?.title || 'Loading...'}</h2>
            <div className="difficulty-underline" style={{ background: getDifficultyColor(currentProblem?.difficulty) }}></div>
          </div>
          <div className="problem-description-section left-align">
            <span className="description-title">Description:</span>
            <span className="problem-description">
              {currentProblem?.description || 'Loading...'}
            </span>
          </div>
          <div className="problem-meta-row">
            <div className="problem-meta-stack">
              <div className="constraints-box">
                <span className="constraints-title">Constraints:</span>
                <div className="constraints-content">
                  {currentProblem?.constraints || 'No constraints provided.'}
                </div>
              </div>
              <div className="sample-box">
                <span className="sample-label">Sample Input:</span>
                <div className="sample-value">{currentProblem?.sample_input || 'No sample input.'}</div>
              </div>
              <div className="sample-box">
                <span className="sample-label">Sample Output:</span>
                <div className="sample-value">{currentProblem?.sample_output || 'No sample output.'}</div>
              </div>
            </div>
            <div className="visual-box visual-right">
              <span className="visual-title">Visual:</span>
              <div className="visual-placeholder">{currentProblem?.visual || 'No visual provided.'}</div>
            </div>
          </div>
          <div className="problem-action-buttons">
            <button 
              className="restart-btn green-btn" 
              onClick={handlePrevProblem}
              disabled={currentProblemIndex === 0}
            >
              ← Previous
            </button>
            <button 
              className="submit-btn" 
              onClick={() => setShowSubmitModal(true)}
              disabled={submitted}
            >
              Submit Assessment
            </button>
            <button 
              className="exit-btn green-btn" 
              onClick={handleNextProblem}
              disabled={currentProblemIndex === problems.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
       
        <div className="vertical-divider-gold"></div>
        
        <div className={`code-editor-overlay-container no-card ${parsedResults ? 'split-layout' : ''}`}>
          <div className={`code-editor-box fill-card with-border ${parsedResults ? 'half-height' : ''}`}>
            <div className="code-editor-overlay language-overlay">
              <select className="language-selector" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="python3">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="code-editor-overlay button-overlay">
              <button className="run-btn" onClick={handleRun} disabled={loading || !code.trim()}>
                {loading ? 'Running...' : 'Run'}
              </button>
            </div>
            <CodeEditor 
              initialCode={code}
              language={language}
              onCodeChange={setCode}
            />
          </div>
          {loading && <p className="code-loading">Running...</p>}
          {parsedResults && (
            <div className="results-container half-height">
              <div className="results-header">
                <h3>Results</h3>
              </div>
              <div className="results-content">
                <div className="result-status">
                  <span className="status-label">Status:</span>
                  <span 
                    className="status-value"
                    style={{ color: parsedResults.error ? '#ff6b6b' : '#558957' }}
                  >
                    {parsedResults.error ? 'ERROR' : 'COMPILED'}
                  </span>
                </div>
                <div className="result-output-section">
                  <span className="output-label">Output:</span>
                  <span className="output-value">{parsedResults.output || 'No output'}</span>
                </div>
                {parsedResults.error && (
                  <div className="result-output">
                    <span className="output-label">Error:</span>
                    <div className="output-content">{parsedResults.error}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Submit Assessment</h2>
              <button 
                className='close-btn'
                onClick={() => setShowSubmitModal(false)}
              >
                ×
              </button>
            </div>
            <div className='modal-body'>
              <p>Are you sure you want to submit your assessment?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className='modal-footer'>
              <button
                className='cancel-btn'
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </button>
              <button
                className='submit-btn'
                onClick={handleSubmitAssessment}
                disabled={submitted}
              >
                {submitted ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssessmentSolving; 