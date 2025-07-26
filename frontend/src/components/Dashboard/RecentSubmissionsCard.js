import React, { useEffect, useState } from "react";
import { fetchRecentSubmissions } from "../../api/submissionApi"; 
import { formatDistanceToNow } from 'date-fns';
import "./RecentSubmissionsCard.css";

function RecentSubmissionsCard({ candidateId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSubmissions = async () => {
      try {
        setLoading(true);
        const data = await fetchRecentSubmissions(candidateId);
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching recent submissions:', error);
        setError('Failed to load recent submissions');
      } finally {
        setLoading(false);
      }
    };
    getSubmissions();
  }, [candidateId]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Unknown date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
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

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="recent-submissions-card">
        <h3>Recent Submissions</h3>
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
      <div className="recent-submissions-card">
        <h3>Recent Submissions</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="recent-submissions-card">
      <h3>Recent Submissions</h3>
      <div className="submission-list">
        {submissions.length > 0 ? submissions.map((submission, index) => {
          const statusColor = getStatusColor(submission.result);
          return (
            <div key={submission.id || index} className="submission-item">
              <div className="submission-content">
                <h4 className="submission-title">
                  {submission.problem?.title || 'Unknown Problem'}
                </h4>
                <div className="submission-details">
                  <span 
                    className="submission-status"
                    style={{ color: statusColor }}
                  >
                    {submission.result || 'UNKNOWN'}
                  </span>
                  <span className="submission-date">
                    {formatDate(submission.submittedAt)}
                  </span>
                  <span className="submission-time">
                    Time: {submission.timeSpent ? formatTime(submission.timeSpent) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="submission-item">
            <p>No recent submissions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentSubmissionsCard;