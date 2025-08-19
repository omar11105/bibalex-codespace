import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '../components/Dashboard/HeaderBar';
import { assessmentApi } from '../api/assessmentApi';
import axios from '../api/axios';
import './ViewAssessments.css';

function ViewAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [availableProblems, setAvailableProblems] = useState([]);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentsRes, sessionsRes, problemsRes] = await Promise.all([
          assessmentApi.getAllAssessments(),
          assessmentApi.getAssessmentSessions(),
          axios.get('problems', { 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
          }).then(res => res.data)
        ]);
        setAssessments(assessmentsRes);
        setSessions(sessionsRes);
        setAvailableProblems(problemsRes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assessment data:', error);
        setError(`Failed to load assessment data: ${error.response?.data?.message || error.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateAssessment = async () => {
    try {
      const assessmentData = {
        problemIds: selectedProblems,
        timeLimit: timeLimit
      };
      await assessmentApi.createAssessment(assessmentData);
      setShowCreateModal(false);
      setSelectedProblems([]);
      setTimeLimit(60);
      // Refresh the assessments list
      const assessmentsRes = await assessmentApi.getAllAssessments();
      setAssessments(assessmentsRes);
    } catch (error) {
      console.error('Error creating assessment:', error);
      setError('Failed to create assessment');
    }
  };

  const handleDeactivateAssessment = async (assessmentId) => {
    try {
      await assessmentApi.deactivateAssessment(assessmentId);
      // Refresh the assessments list
      const assessmentsRes = await assessmentApi.getAllAssessments();
      setAssessments(assessmentsRes);
    } catch (error) {
      console.error('Error deactivating assessment:', error);
      setError('Failed to deactivate assessment');
    }
  };

  const handleDuplicateAssessment = async (assessmentId) => {
    try {
      const result = await assessmentApi.duplicateAssessment(assessmentId);
      // Refresh the assessments list
      const assessmentsRes = await assessmentApi.getAllAssessments();
      setAssessments(assessmentsRes);
    } catch (error) {
      console.error('Error duplicating assessment:', error);
      console.error('Error details:', error.response?.data);
      setError(`Failed to duplicate assessment: ${error.response?.data?.message || error.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (completed) => {
    return completed ? '#558957' : '#C7A925';
  };

  if (!user || !user.id) {
    return <div>Please log in to view assessments.</div>;
  }

  if (loading) {
    return (
      <div className='view-assessments-root'>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Loading assessments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='view-assessments-root'>
        <div className='error-message'>{error}</div>
      </div>
    );
  }

  return (
    <div className='view-assessments-root'>
      <HeaderBar 
        user={user} 
        customTitle="Assessment Management"
        customSubtitle="Manage coding assessments and view results"
        onBack={() => navigate('/adminDashboard')}
      />
      <div className='view-assessments-content'>
        <div className='assessments-header'>
          <button 
            className='create-assessment-btn'
            onClick={() => setShowCreateModal(true)}
          >
            <span className='plus-icon'>+</span>
            Create Assessment
          </button>
        </div>

        <div className='assessments-grid'>
          <div className='assessments-section'>
            <h2>Active Assessments</h2>
            <div className='assessments-list'>
              {assessments.filter(a => a.active).map(assessment => (
                <div key={assessment.id} className='assessment-card'>
                  <div className='assessment-header'>
                    <h3>Assessment #{assessment.id}</h3>
                    <span className='access-code'>Code: {assessment.accessCode}</span>
                  </div>
                  <div className='assessment-details'>
                    <p><strong>Problems:</strong> {assessment.problems?.length || 0}</p>
                    <p><strong>Time Limit:</strong> {assessment.timeLimit} minutes</p>
                    <p><strong>Created:</strong> {formatDate(assessment.createdAt)}</p>
                  </div>
                  <div className='assessment-actions'>
                    <div className='assessment-status-left'>
                      <span className='status-badge active'>Active</span>
                    </div>
                    <div className='assessment-buttons-right'>
                      <button 
                        className='deactivate-btn'
                        onClick={() => handleDeactivateAssessment(assessment.id)}
                        title="Deactivate Assessment"
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {assessments.filter(a => a.active).length === 0 && (
                <div className='no-assessments'>
                  <p>No active assessments found.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className='vertical-divider'></div>
          
          <div className='assessments-section'>
            <h2>Assessment Results</h2>
            <div className='sessions-list'>
              {sessions.map(session => (
                <div key={session.id} className='session-card'>
                  <div className='session-header'>
                    <h3>{session.candidateEmail}</h3>
                    <span className='session-score'>{session.score}%</span>
                  </div>
                  <div className='session-details'>
                    <p><strong>Assessment:</strong> #{session.assessmentId}</p>
                    <p><strong>Started:</strong> {formatDate(session.startTime)}</p>
                    {session.submittedAt && (
                      <p><strong>Submitted:</strong> {formatDate(session.submittedAt)}</p>
                    )}
                  </div>
                  <div className='session-status'>
                    <span 
                      className='status-badge'
                      style={{ backgroundColor: getStatusColor(session.completed) }}
                    >
                      {session.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <div className='no-sessions'>
                  <p>No assessment sessions found.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className='vertical-divider'></div>
          
          <div className='assessments-section'>
            <h2>Inactive Assessments</h2>
            <div className='assessments-list'>
              {assessments.filter(a => !a.active).map(assessment => (
                <div key={assessment.id} className='assessment-card inactive'>
                  <div className='assessment-header'>
                    <h3>Assessment #{assessment.id}</h3>
                    <span className='access-code'>Code: {assessment.accessCode}</span>
                  </div>
                  <div className='assessment-details'>
                    <p><strong>Problems:</strong> {assessment.problems?.length || 0}</p>
                    <p><strong>Time Limit:</strong> {assessment.timeLimit} minutes</p>
                    <p><strong>Created:</strong> {formatDate(assessment.createdAt)}</p>
                  </div>
                  <div className='assessment-actions'>
                    <div className='assessment-status-left'>
                      <span className='status-badge inactive'>Inactive</span>
                    </div>
                    <div className='assessment-buttons-right'>
                      <button 
                        className='duplicate-btn'
                        onClick={() => handleDuplicateAssessment(assessment.id)}
                        title="Clone Assessment with Same Settings"
                      >
                        Clone
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {assessments.filter(a => !a.active).length === 0 && (
                <div className='no-assessments'>
                  <p>No inactive assessments found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Assessment Modal */}
        {showCreateModal && (
          <div className='modal-overlay'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h2>Create New Assessment</h2>
                <button 
                  className='close-btn'
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              <div className='modal-body'>
                <div className='form-group'>
                  <label>Select Problems:</label>
                  <div className='problems-selection'>
                    {availableProblems.map(problem => (
                      <label key={problem.id} className='problem-checkbox'>
                        <input
                          type='checkbox'
                          checked={selectedProblems.includes(problem.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProblems([...selectedProblems, problem.id]);
                            } else {
                              setSelectedProblems(selectedProblems.filter(id => id !== problem.id));
                            }
                          }}
                        />
                        <span>{problem.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className='form-group'>
                  <label>Time Limit (minutes):</label>
                  <input
                    type='number'
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                    min='15'
                    max='300'
                  />
                </div>
              </div>
              <div className='modal-footer'>
                <button 
                  className='cancel-btn'
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className='create-btn'
                  onClick={handleCreateAssessment}
                  disabled={selectedProblems.length === 0}
                >
                  Create Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAssessments; 