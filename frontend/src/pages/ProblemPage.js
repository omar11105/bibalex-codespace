import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import axios from '../api/axios';
import './ProblemPage.css';
import '../components/Dashboard/HeaderBar.css';

function ProblemPage({ mode = 'assessment' }) { 
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python3');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchProblem();
      startTimer();
    }
    
    // Cleanup timer when component unmounts
    return () => {
      stopTimer();
    };
  }, [id]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(`/problems/${id}`);
      setProblem(response.data);
    } catch (error) {
      console.error('Error fetching problem:', error);
    }
  };

  const startTimer = () => {
    // Check if we have saved time for this problem
    const savedStartTime = localStorage.getItem(`problem_${id}_start`);
    
    if (savedStartTime) {
      const startTime = parseInt(savedStartTime);
      const currentTime = Date.now();
      const timeDiff = Math.floor((currentTime - startTime) / 1000);
      setElapsedTime(timeDiff);
    } else {
      // First time on this problem
      const currentTime = Date.now();
      localStorage.setItem(`problem_${id}_start`, currentTime.toString());
      setElapsedTime(0);
    }
    
    setIsTimerRunning(true);
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    localStorage.removeItem(`problem_${id}_time`);
    localStorage.removeItem(`problem_${id}_start`);
    setElapsedTime(0);
    startTimer();
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    stopTimer();
    navigate('/candidateDashboard');
  };

  const handleRestart = () => {
    resetTimer();
    setCode('');
    setResults(null);
  };

  const handleRun = async () => {
    setLoading(true);
    setResults(null);
    try {
      const response = await axios.post('/candidate/submissions', {
        code,
        language,
        problemId: parseInt(id),
        runOnly: true
      });
              // Run response received
      setResults(response.data);
    } catch (error) {
      console.error('Run error:', error);
      setResults({ error: 'Error running code' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResults(null);
    try {
      const response = await axios.post('/candidate/submissions', {
        code,
        language,
        problemId: parseInt(id),
        timeSpent: elapsedTime
      });
              // Submit response received
      setResults(response.data);
      
      // Stop timer only if problem is passed
      if (response.data.result === 'PASSED') {
        stopTimer();
        localStorage.removeItem(`problem_${id}_start`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setResults({ error: 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  // Parse constraints string into array (split by newline or semicolon)
  const constraintList = problem?.constraints
    ? problem.constraints.split(/\n|;/).map(s => s.trim()).filter(Boolean)
    : [];

  // Determine mode label
  const modeLabel = mode === 'practice' ? 'Practice Mode' : 'Assessment Mode';

  // Difficulty color for the line
  const getDifficultyColor = (difficulty) => {
    switch ((difficulty || '').toUpperCase()) {
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
  const difficultyColor = getDifficultyColor(problem?.difficulty);

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PASSED':
        return '#558957';
      case 'PARTIALLY PASSED':
      case 'PARTIAL':
        return '#C7A925';
      case 'FAILED':
        return '#FF6B6B';
      default:
        return '#E8DDBE';
    }
  };

  // Parse results for display
  const parseResults = (results) => {
    if (!results) return null;
    
    if (results.error) {
      return {
        status: 'ERROR',
        output: results.error,
        testCasesPassed: 0,
        totalTestCases: 0,
        timeTaken: 'N/A',
        testCaseResults: []
      };
    }

    // Handle the backend response structure
    const status = results.result || 'UNKNOWN';
    const output = results.output || 'No output';
    const testCasesPassed = results.passedTests || 0;
    const totalTestCases = results.totalTests || 0;
    const timeTaken = results.timeTaken || results.executionTime || 'N/A';
    const testCaseResults = results.testCaseResults || [];

    return {
      status,
      output,
      testCasesPassed,
      totalTestCases,
      timeTaken,
      testCaseResults
    };
  };

  const parsedResults = parseResults(results);

  return (
    <div className="problem-page">
      <div className="problem-root">
        <div className="header-bar">
          <div className="left">
            <h1>BA</h1>
          </div>
          <div className="center">
            <h2>{modeLabel}</h2>
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
              <h2 className="problem-title">{problem?.title || 'Loading...'}</h2>
              <div className="difficulty-underline" style={{ background: difficultyColor }}></div>
            </div>
            <div className="elapsed-time-section left-align">
              <span className="elapsed-label">Elapsed Time:</span>
              <span className="elapsed-value">{formatTime(elapsedTime)}</span>
            </div>
            <div className="problem-description-section left-align">
              <span className="problem-description">
                {problem?.description || 'Loading...'}
              </span>
            </div>
            <div className="problem-meta-row">
              <div className="problem-meta-stack">
                <div className="constraints-box">
                  <span className="constraints-title">Constraints:</span>
                  <ul>
                    {constraintList.length > 0 ? constraintList.map((c, i) => <li key={i}>{c}</li>) : <li>No constraints provided.</li>}
                  </ul>
                </div>
                <div className="sample-box">
                  <span className="sample-label">Sample Input:</span>
                  <div className="sample-value">{problem?.sample_input || 'No sample input.'}</div>
                </div>
                <div className="sample-box">
                  <span className="sample-label">Sample Output:</span>
                  <div className="sample-value">{problem?.sample_output || 'No sample output.'}</div>
                </div>
              </div>
              <div className="visual-box visual-right">
                <span className="visual-title">Visual:</span>
                <div className="visual-placeholder">{problem?.visual || 'No visual provided.'}</div>
              </div>
            </div>
            <div className="problem-action-buttons right-align">
              <button className="problem-restart-btn green-btn" onClick={handleRestart}>Restart</button>
              <button className="problem-exit-btn green-btn" onClick={handleExit}>Exit</button>
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
                <button className="problem-run-btn" onClick={handleRun}>Run</button>
                <button className="problem-submit-btn" onClick={handleSubmit}>Submit</button>
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
                      style={{ color: getStatusColor(parsedResults.status) }}
                    >
                      {parsedResults.status} ({parsedResults.testCasesPassed}/{parsedResults.totalTestCases})
                    </span>
                  </div>
                  <div className="result-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Test Cases:</span>
                      <span className="metric-value">
                        {parsedResults.testCasesPassed}/{parsedResults.totalTestCases}
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Time:</span>
                      <span className="metric-value">{parsedResults.timeTaken}</span>
                    </div>
                  </div>
                  {parsedResults.testCaseResults && parsedResults.testCaseResults.length > 0 && (
                    <div className="test-case-results">
                      <span className="test-cases-label">Test Case Results:</span>
                      <div className="test-cases-list">
                        {parsedResults.testCaseResults.map((testCase, index) => (
                          <div key={testCase.testCaseId || index} className={`test-case-item ${testCase.passed ? 'passed' : 'failed'}`}>
                            <div className="test-case-header">
                              <span className="test-case-number">Test Case {index + 1}</span>
                              <span className={`test-case-status ${testCase.passed ? 'passed' : 'failed'}`}>
                                {testCase.passed ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                            <div className="test-case-details">
                              <div className="test-case-input">
                                <span className="detail-label">Input:</span>
                                <div className="detail-content">{testCase.input}</div>
                              </div>
                              <div className="test-case-outputs">
                                <div className="expected-output">
                                  <span className="detail-label">Expected:</span>
                                  <div className="detail-content">{testCase.expectedOutput}</div>
                                </div>
                                <div className="actual-output">
                                  <span className="detail-label">Actual:</span>
                                  <div className="detail-content">{testCase.actualOutput}</div>
                                </div>
                              </div>
                              {testCase.error && (
                                <div className="test-case-error">
                                  <span className="error-label">Error:</span>
                                  <div className="error-content">{testCase.error}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;