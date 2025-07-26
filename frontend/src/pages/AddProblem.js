import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './AddProblem.css';
import '../components/Dashboard/HeaderBar.css';

function AddProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'MEDIUM',
    sample_input: '',
    sample_output: '',
    constraints: '',
    visual: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/admin/problems', formData);
              // Problem created successfully
      setSuccess('Problem created successfully!');
      setTimeout(() => {
        navigate('/adminDashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating problem:', error);
      setError(error.response?.data?.message || 'Failed to create problem');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/adminDashboard');
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

  return (
    <div className="add-problem-root">
      <div className="header-bar">
        <div className="left">
          <h1>BA</h1>
        </div>
        <div className="center">
          <h2>Add New Problem</h2>
        </div>
        <div className="right">
          <button className="logout-btn" onClick={handleCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="add-problem-content">
        <div className="form-panel">
          <h3>Problem Details</h3>
          <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Problem Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter problem title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty *</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                  <div 
                    className="difficulty-preview"
                    style={{ backgroundColor: getDifficultyColor(formData.difficulty) }}
                  ></div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter problem description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="constraints">Constraints</label>
                  <textarea
                    id="constraints"
                    name="constraints"
                    value={formData.constraints}
                    onChange={handleInputChange}
                    placeholder="Enter problem constraints (optional)"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="visual">Visual Description</label>
                  <textarea
                    id="visual"
                    name="visual"
                    value={formData.visual}
                    onChange={handleInputChange}
                    placeholder="Enter visual description (optional)"
                    rows="2"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sample_input">Sample Input</label>
                  <textarea
                    id="sample_input"
                    name="sample_input"
                    value={formData.sample_input}
                    onChange={handleInputChange}
                    placeholder="Enter sample input"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sample_output">Sample Output</label>
                  <textarea
                    id="sample_output"
                    name="sample_output"
                    value={formData.sample_output}
                    onChange={handleInputChange}
                    placeholder="Enter sample output"
                    rows="2"
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {success && (
                <div className="success-message">
                  {success}
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Problem'}
                </button>
              </div>
            </form>
        </div>

        <div className="vertical-divider-gold"></div>

        <div className="preview-panel">
          <div className="preview-card">
            <h3>Problem Preview</h3>
            <div className="preview-content">
              <div className="preview-title-section">
                <h4 className="preview-title">
                  {formData.title || 'Problem Title'}
                </h4>
                <div 
                  className="preview-difficulty"
                  style={{ backgroundColor: getDifficultyColor(formData.difficulty) }}
                >
                  {formData.difficulty || 'MEDIUM'}
                </div>
              </div>

              <div className="preview-description">
                {formData.description || 'Problem description will appear here...'}
              </div>

              {formData.constraints && (
                <div className="preview-constraints">
                  <h5>Constraints:</h5>
                  <p>{formData.constraints}</p>
                </div>
              )}

              {(formData.sample_input || formData.sample_output) && (
                <div className="preview-samples">
                  {formData.sample_input && (
                    <div className="preview-sample">
                      <h5>Sample Input:</h5>
                      <div className="sample-content">{formData.sample_input}</div>
                    </div>
                  )}
                  {formData.sample_output && (
                    <div className="preview-sample">
                      <h5>Sample Output:</h5>
                      <div className="sample-content">{formData.sample_output}</div>
                    </div>
                  )}
                </div>
              )}

              {formData.visual && (
                <div className="preview-visual">
                  <h5>Visual:</h5>
                  <p>{formData.visual}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProblem; 