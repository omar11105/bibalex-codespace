import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import HeaderBar from '../components/Dashboard/HeaderBar';
import './ViewAllProblems.css';

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

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (loading) {
    return (
      <div className="view-problems-root">
        <HeaderBar 
          user={user}
          customTitle="All Problems"
          customSubtitle="Browse and solve coding challenges"
          onBack={handleBack}
        />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-problems-root">
      <HeaderBar 
        user={user}
        customTitle="All Problems"
        customSubtitle="Browse and solve coding challenges"
        onBack={handleBack}
      />

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