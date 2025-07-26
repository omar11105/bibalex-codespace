import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './ViewAllProblems.css';
import '../components/Dashboard/HeaderBar.css';

function ViewAllProblems() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('/problems');
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
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

  const filteredProblems = problems.filter(problem => {
    const matchesFilter = filter === 'ALL' || problem.difficulty === filter;
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleProblemClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  const handleBack = () => {
    navigate('/candidateDashboard');
  };

  if (loading) {
    return (
      <div className="view-problems-root">
        <div className="header-bar">
          <div className="left">
            <h1>BA</h1>
          </div>
          <div className="center">
            <h2>All Problems</h2>
          </div>
          <div className="right">
            <button className="logout-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-problems-root">
      <div className="header-bar">
        <div className="left">
          <h1>BA</h1>
        </div>
        <div className="center">
          <h2>All Problems</h2>
        </div>
        <div className="right">
          <button className="logout-btn" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="view-problems-content">
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'EASY' ? 'active' : ''}`}
              onClick={() => setFilter('EASY')}
            >
              Easy
            </button>
            <button
              className={`filter-btn ${filter === 'MEDIUM' ? 'active' : ''}`}
              onClick={() => setFilter('MEDIUM')}
            >
              Medium
            </button>
            <button
              className={`filter-btn ${filter === 'HARD' ? 'active' : ''}`}
              onClick={() => setFilter('HARD')}
            >
              Hard
            </button>
          </div>
        </div>

        <div className="problems-grid">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {filteredProblems.length === 0 ? (
            <div className="no-problems">
              <p>No problems found matching your criteria.</p>
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className="problem-card"
                onClick={() => handleProblemClick(problem.id)}
              >
                <div className="problem-header">
                  <h3 className="problem-title">{problem.title}</h3>
                  <div
                    className="problem-difficulty"
                    style={{ backgroundColor: getDifficultyColor(problem.difficulty) }}
                  >
                    {problem.difficulty}
                  </div>
                </div>
                <p className="problem-description">
                  {problem.description.length > 150
                    ? `${problem.description.substring(0, 150)}...`
                    : problem.description}
                </p>
                <div className="problem-footer">
                  <span className="problem-id">#{problem.id}</span>
                  <button className="solve-btn">Solve</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAllProblems; 