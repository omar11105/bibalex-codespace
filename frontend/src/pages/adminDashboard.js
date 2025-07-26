import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import HeaderBar from '../components/Dashboard/HeaderBar';
import LeaderboardCard from '../components/Dashboard/LeaderboardCard';
import './adminDashboard.css';

function AdminDashboard() {
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, submissionsRes] = await Promise.all([
          axios.get('/admin/problems', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('/admin/submissions', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        ]);
        setProblems(problemsRes.data);
        setSubmissions(submissionsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load dashboard data');
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

  if (!user || !user.id) {
    return <div>Please log in to view your dashboard.</div>;
  }

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='dashboard-container'>
      <HeaderBar user={user} />
      <div className='dashboard-content'>
        <div className='dashboard-main-grid'>
          <div className='dashboard-left-side'>
            <div className='admin-card'>
              <h2>Problems</h2>
              <div className='problems-list'>
                {problems.map(problem => (
                  <div 
                    key={problem.id} 
                    className='problem-item'
                    onClick={() => navigate(`/edit-problems?edit=${problem.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3>{problem.title}</h3>
                    <p>Difficulty: {problem.difficulty}</p>
                    <p>{problem.description.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='horizontal-divider'></div>
            <div className='admin-card'>
              <h2>Admin Stats</h2>
              <div className='stats-grid'>
                <div className='stat-item'>
                  <h3>{problems.length}</h3>
                  <p>Total Problems</p>
                </div>
                <div className='stat-item'>
                  <h3>{submissions.length}</h3>
                  <p>Total Submissions</p>
                </div>
                <div className='stat-item'>
                  <h3>{new Set(submissions.map(s => s.user?.id)).size}</h3>
                  <p>Active Users</p>
                </div>
              </div>
            </div>
          </div>
         
          <div className='dashboard-divider'></div>
          
          <div className='dashboard-right-side'>
            <div className='dashboard-right-top'>
              <div className='admin-card'>
                <h2>Quick Actions</h2>
                <div className='quick-actions'>
                  <button className='action-btn' onClick={() => navigate('/add-problem')}>Add New Problem</button>
                  <button className='action-btn' onClick={() => navigate('/edit-problems')}>Edit Problems</button>
                  <button className='action-btn'>View Analytics</button>
                </div>
              </div>
              <div className='vertical-divider-small'></div>
              <LeaderboardCard currentUser={user} />
            </div>
            <div className='horizontal-divider'></div>
            <div className='admin-card'>
              <h2>Recent Submissions</h2>
              <div className='submissions-list'>
                {submissions.slice(0, 5).map(submission => (
                  <div key={submission.id} className='submission-item'>
                    <div className='submission-content'>
                      <h4 className='submission-title'>
                        {submission.problem?.title || 'Unknown Problem'}
                      </h4>
                      <div className='submission-details'>
                        <span className='submission-user'>
                          {submission.user?.username || 'Unknown User'}
                        </span>
                        <span 
                          className='submission-status'
                          style={{ color: getStatusColor(submission.result) }}
                        >
                          {submission.result || 'UNKNOWN'}
                        </span>
                        <span className='submission-language'>
                          {submission.language || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
