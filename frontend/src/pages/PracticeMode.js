import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import HeaderBar from '../components/Dashboard/HeaderBar';
import { assessmentApi } from '../api/assessmentApi';
import axios from '../api/axios';
import './AssessmentSolving.css';

function PracticeMode() {
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
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [practiceResults, setPracticeResults] = useState(null);
  const [initializing, setInitializing] = useState(true);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const initializePractice = async () => {
      try {
        setInitializing(true);
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        if (!user) {
          navigate('/login');
          return;
        }

        // Initialize practice session with problems and timer
        const session = await assessmentApi.startPractice(user.email);
        setProblems(session.problems);
        setSessionId(session.sessionId);
        setTimeLimit(session.timeLimit * 60); // Convert to seconds
        setTimeRemaining(session.timeLimit * 60);
        
        // Store session data for persistence
        const sessionData = {
          ...session,
          startTime: Date.now(),
          isPractice: true
        };
        localStorage.setItem('practiceSession', JSON.stringify(sessionData));
        
        startTimer();
        setInitializing(false);
      } catch (error) {
        console.error('Error starting practice:', error);
        navigate('/candidateDashboard');
      }
    };

    initializePractice();

    return () => {
      stopTimer();
    };
  }, [navigate]);

  useEffect(() => {
    if (problems.length > 0) {
      setCurrentProblem(problems[currentProblemIndex]);
      // Load saved code for current problem or initialize empty
      const savedCode = localStorage.getItem(`practice_${sessionId}_problem_${currentProblemIndex}`);
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

  const handleSubmit = async () => {
    if (!currentProblem) return;

    setLoading(true);
    try {
      const response = await axios.post('candidate/submissions', {
        problemId: currentProblem.id,
        code: code,
        language: language,
        runOnly: false
      });

      setResults(response.data);
      
      // Persist code for current problem
      localStorage.setItem(`practice_${sessionId}_problem_${currentProblemIndex}`, code);
    } catch (error) {
      console.error('Error submitting code:', error);
      setResults({ output: 'Error: ' + (error.response?.data?.message || error.message) });
    } finally {
      setLoading(false);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  };

  const handlePrevProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  };

  const handleSubmitPractice = async () => {
    setSubmitted(true);
    stopTimer();
    setShowSubmitModal(false);
    
    try {
      // Evaluate all problems and calculate final score
      let totalScore = 0;
      let totalProblems = problems.length;
      let passedProblems = 0;
      let failedProblems = 0;
      let problemResults = [];
      
      for (let i = 0; i < problems.length; i++) {
        const savedCode = localStorage.getItem(`practice_${sessionId}_problem_${i}`);
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
            
            const isPassed = response.data.passedTests === response.data.totalTests;
            if (isPassed) {
              totalScore += 100;
              passedProblems++;
            } else {
              failedProblems++;
            }
            
            problemResults.push({
              problemTitle: problems[i].title,
              passed: isPassed,
              passedTests: response.data.passedTests,
              totalTests: response.data.totalTests
            });
          } catch (error) {
            console.error(`Error evaluating problem ${i}:`, error);
            failedProblems++;
            problemResults.push({
              problemTitle: problems[i].title,
              passed: false,
              passedTests: 0,
              totalTests: 0
            });
          }
        } else {
          failedProblems++;
          problemResults.push({
            problemTitle: problems[i].title,
            passed: false,
            passedTests: 0,
            totalTests: 0
          });
        }
      }
      
      const finalScore = Math.round(totalScore / totalProblems);
      
      // Submit practice results to backend
      await assessmentApi.submitPracticeScore(sessionId, finalScore);
      
      // Set results for display
      setPracticeResults({
        percentage: finalScore,
        passedProblems,
        failedProblems,
        totalProblems,
        problemResults
      });
      
      setShowResultsModal(true);
      
    } catch (error) {
      console.error('Error submitting practice:', error);
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
      let passedProblems = 0;
      let failedProblems = 0;
      let problemResults = [];
      
      for (let i = 0; i < problems.length; i++) {
        const savedCode = localStorage.getItem(`practice_${sessionId}_problem_${i}`);
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
            
            const isPassed = response.data.passedTests === response.data.totalTests;
            if (isPassed) {
              totalScore += 100;
              passedProblems++;
            } else {
              failedProblems++;
            }
            
            problemResults.push({
              problemTitle: problems[i].title,
              passed: isPassed,
              passedTests: response.data.passedTests,
              totalTests: response.data.totalTests
            });
          } catch (error) {
            console.error(`Error evaluating problem ${i}:`, error);
            failedProblems++;
            problemResults.push({
              problemTitle: problems[i].title,
              passed: false,
              passedTests: 0,
              totalTests: 0
            });
          }
        } else {
          failedProblems++;
          problemResults.push({
            problemTitle: problems[i].title,
            passed: false,
            passedTests: 0,
            totalTests: 0
          });
        }
      }
      
      const finalScore = Math.round(totalScore / totalProblems);
      
      // Submit practice results to backend
      await assessmentApi.submitPracticeScore(sessionId, finalScore);
      
      // Set results for display
      setPracticeResults({
        percentage: finalScore,
        passedProblems,
        failedProblems,
        totalProblems,
        problemResults
      });
      
      setShowResultsModal(true);
      
    } catch (error) {
      console.error('Error auto-submitting practice:', error);
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
    stopTimer();
    localStorage.removeItem('practiceSession');
    
    // Clear saved code for this session
    for (let i = 0; i < problems.length; i++) {
      localStorage.removeItem(`practice_${sessionId}_problem_${i}`);
    }
    
    navigate('/candidateDashboard');
  };

  if (initializing) {
    return (
      <div className="assessment-solving-root">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Initializing practice mode...</p>
        </div>
      </div>
    );
  }



  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !user.id) {
    return <div>Please log in to access practice mode.</div>;
  }

  if (!currentProblem) {
    return <div>Loading practice...</div>;
  }

  const parsedResults = parseResults(results);

  return (
    <div className="problem-root">
      <div className="header-bar">
        <div className="left">
          <h1>BA</h1>
        </div>
        <div className="center">
          <h2>Practice Mode in Progress - Problem {currentProblemIndex + 1} of {problems.length}</h2>
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
              Submit Practice
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
              <h2>Submit Practice</h2>
              <button 
                className='close-btn'
                onClick={() => setShowSubmitModal(false)}
              >
                ×
              </button>
            </div>
            <div className='modal-body'>
              <p>Are you sure you want to submit your practice session?</p>
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
                onClick={handleSubmitPractice}
                disabled={submitted}
              >
                {submitted ? 'Submitting...' : 'Submit Practice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResultsModal && practiceResults && (
        <div className='modal-overlay'>
          <div className='modal-content results-modal'>
            <div className='modal-header'>
              <h2>Practice Results</h2>
            </div>
            <div className='modal-body'>
              <div className='results-summary'>
                <div className='score-display'>
                  <h3>Your Score</h3>
                  <div className='percentage-circle'>
                    <span className='percentage'>{practiceResults.percentage}%</span>
                  </div>
                </div>
                
                <div className='problem-stats'>
                  <div className='stat-item passed'>
                    <span className='stat-label'>Passed Problems:</span>
                    <span className='stat-value'>{practiceResults.passedProblems}</span>
                  </div>
                  <div className='stat-item failed'>
                    <span className='stat-label'>Failed Problems:</span>
                    <span className='stat-value'>{practiceResults.failedProblems}</span>
                  </div>
                  <div className='stat-item total'>
                    <span className='stat-label'>Total Problems:</span>
                    <span className='stat-value'>{practiceResults.totalProblems}</span>
                  </div>
                </div>

                <div className='problem-breakdown'>
                  <h4>Problem Breakdown:</h4>
                  {practiceResults.problemResults.map((result, index) => (
                    <div key={index} className={`problem-result ${result.passed ? 'passed' : 'failed'}`}>
                      <span className='problem-title'>{result.problemTitle}</span>
                      <span className='problem-status'>
                        {result.passed ? '✅ Passed' : '❌ Failed'}
                        {result.totalTests > 0 && (
                          <span className='test-count'>
                            ({result.passedTests}/{result.totalTests} tests)
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className='encouragement-message'>
                  {practiceResults.percentage >= 80 ? (
                    <p>🎉 Excellent work! You're showing great problem-solving skills!</p>
                  ) : practiceResults.percentage >= 60 ? (
                    <p>👍 Good effort! Keep practicing to improve your skills!</p>
                  ) : practiceResults.percentage >= 40 ? (
                    <p>💪 You're making progress! Review the problems and try again!</p>
                  ) : (
                    <p>🌟 Don't give up! Every practice session makes you stronger!</p>
                  )}
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button
                className='dashboard-btn'
                onClick={() => {
                  // Clear practice session data
                  localStorage.removeItem('practiceSession');
                  for (let i = 0; i < problems.length; i++) {
                    localStorage.removeItem(`practice_${sessionId}_problem_${i}`);
                  }
                  navigate('/candidateDashboard');
                }}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticeMode; 