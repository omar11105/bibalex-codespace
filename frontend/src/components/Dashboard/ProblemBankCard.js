import React, { useEffect, useState } from "react";
import { fetchProblemBank } from "../../api/problemApi";
import { useNavigate } from "react-router-dom";
import "./ProblemBankCard.css";

function ProblemBankCard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblemBank()
      .then(data => {
        setProblems(data.slice(0, 3));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching problem bank:', error);
        setError('Failed to load problem bank');
        setLoading(false);
      });
  }, []);

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

  const handleProblemClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  if (loading) {
    return (
      <div className="problem-bank-card">
        <h3>Problem Bank</h3>
        <div className="loading-placeholder">
          <div className="loading-line"></div>
          <div className="loading-line"></div>
          <div className="loading-line"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="problem-bank-card">
        <h3>Problem Bank</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="problem-bank-card">
        <h3>Problem Bank</h3>
        <p>No problems available in the bank.</p>
      </div>
    );
  }

  return (
    <div className="problem-bank-card">
      <h3>Problem Bank</h3>
      <div className="problem-list">
        {problems.map((problem) => {
          const difficultyColor = getDifficultyColor(problem.difficulty);
          return (
            <div 
              key={problem.id} 
              className="problem-item"
              style={{ borderColor: difficultyColor }}
              onClick={() => handleProblemClick(problem.id)}
            >
              <h4>{problem.title}</h4>
              <p className="problem-language">Language Used</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProblemBankCard;
