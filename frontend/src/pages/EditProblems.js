import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import './EditProblems.css';
import '../components/Dashboard/HeaderBar.css';

function EditProblems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProblem, setEditingProblem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    // Check if there's an edit parameter in the URL
    const urlParams = new URLSearchParams(location.search);
    const editProblemId = urlParams.get('edit');
    
    if (editProblemId && problems.length > 0) {
      const problemToEdit = problems.find(p => p.id.toString() === editProblemId);
      if (problemToEdit) {
        setEditingProblem(problemToEdit);
      }
    }
  }, [problems, location.search]);

  const fetchProblems = async () => {
    try {
      const response = await axios.get('/admin/problems', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
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

  const handleEdit = (problem) => {
    setEditingProblem(problem);
  };

  const handleDelete = async (problemId) => {
    try {
      await axios.delete(`/admin/problems/${problemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProblems(problems.filter(p => p.id !== problemId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting problem:', error);
      setError('Failed to delete problem');
    }
  };

  const handleSaveEdit = async (updatedProblem) => {
    try {
      await axios.put(`/admin/problems/${updatedProblem.id}`, updatedProblem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProblems(problems.map(p => p.id === updatedProblem.id ? updatedProblem : p));
      setEditingProblem(null);
    } catch (error) {
      console.error('Error updating problem:', error);
      setError('Failed to update problem');
    }
  };

  const handleCancelEdit = () => {
    setEditingProblem(null);
  };

  const handleBack = () => {
    navigate('/adminDashboard');
  };

  if (loading) {
    return (
      <div className="edit-problems-root">
        <div className="header-bar">
          <div className="left">
            <h1>BA</h1>
          </div>
          <div className="center">
            <h2>Edit Problems</h2>
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
    <div className="edit-problems-root">
      <div className="header-bar">
        <div className="left">
          <h1>BA</h1>
        </div>
        <div className="center">
          <h2>Edit Problems</h2>
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

      <div className="edit-problems-content">
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
              <div key={problem.id} className="problem-card">
                {editingProblem?.id === problem.id ? (
                  <EditProblemForm
                    problem={problem}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <>
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
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(problem)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => setShowDeleteConfirm(problem.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this problem? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="delete-confirm-btn"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Edit Problem Form Component
function EditProblemForm({ problem, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    sample_input: problem.sample_input || '',
    sample_output: problem.sample_output || '',
    constraints: problem.constraints || '',
    visual: problem.visual || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...problem, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-row">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            required
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Sample Input</label>
          <textarea
            name="sample_input"
            value={formData.sample_input}
            onChange={handleInputChange}
            rows="2"
          />
        </div>
        <div className="form-group">
          <label>Sample Output</label>
          <textarea
            name="sample_output"
            value={formData.sample_output}
            onChange={handleInputChange}
            rows="2"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Constraints</label>
        <textarea
          name="constraints"
          value={formData.constraints}
          onChange={handleInputChange}
          rows="2"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditProblems; 