import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import HeaderBar from '../components/Dashboard/HeaderBar';
import './AddProblem.css';

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

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="add-problem-page">
      <div className="add-problem-root">
        <HeaderBar 
          user={user}
          customTitle="Add New Problem"
          customSubtitle="Create a new coding challenge for candidates"
          onBack={handleCancel}
        />

        <div className="add-problem-content">
          <div className="add-problem-form-panel">
            <h3>Problem Details</h3>
            <form onSubmit={handleSubmit}>
                <div className="add-problem-form-row">
                  <div className="add-problem-form-group">
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

                  <div className="add-problem-form-group">
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
                      className="add-problem-difficulty-preview"
                      style={{ backgroundColor: getDifficultyColor(formData.difficulty) }}
                    ></div>
                  </div>
                </div>

                <div className="add-problem-form-group">
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

                <div className="add-problem-form-row">
                  <div className="add-problem-form-group">
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

                  <div className="add-problem-form-group">
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

                <div className="add-problem-form-row">
                  <div className="add-problem-form-group">
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

                  <div className="add-problem-form-group">
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
                  <div className="add-problem-error-message">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="add-problem-success-message">
                    {success}
                  </div>
                )}

                <div className="add-problem-form-actions">
                  <button 
                    type="button" 
                    className="add-problem-cancel-btn" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="add-problem-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Problem'}
                  </button>
                </div>
              </form>
          </div>

          <div className="add-problem-vertical-divider-gold"></div>

          <div className="add-problem-preview-panel">
            <div className="add-problem-preview-card">
              <h3>Problem Preview</h3>
              <div className="add-problem-preview-content">
                <div className="add-problem-preview-title-section">
                  <h4 className="add-problem-preview-title">
                    {formData.title || 'Problem Title'}
                  </h4>
                  <div 
                    className="add-problem-preview-difficulty"
                    style={{ backgroundColor: getDifficultyColor(formData.difficulty) }}
                  >
                    {formData.difficulty || 'MEDIUM'}
                  </div>
                </div>

                <div className="add-problem-preview-description">
                  {formData.description || 'Problem description will appear here...'}
                </div>

                {formData.constraints && (
                  <div className="add-problem-preview-constraints">
                    <h5>Constraints:</h5>
                    <p>{formData.constraints}</p>
                  </div>
                )}

                {(formData.sample_input || formData.sample_output) && (
                  <div className="add-problem-preview-samples">
                    {formData.sample_input && (
                      <div className="add-problem-preview-sample">
                        <h5>Sample Input:</h5>
                        <div className="add-problem-sample-content">{formData.sample_input}</div>
                      </div>
                    )}
                    {formData.sample_output && (
                      <div className="add-problem-preview-sample">
                        <h5>Sample Output:</h5>
                        <div className="add-problem-sample-content">{formData.sample_output}</div>
                      </div>
                    )}
                  </div>
                )}

                {formData.visual && (
                  <div className="add-problem-preview-visual">
                    <h5>Visual:</h5>
                    <p>{formData.visual}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProblem; 