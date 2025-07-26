import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../../api/LeaderboardApi";
import "./LeaderboardCard.css";

function LeaderboardCard({ currentUser }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                setLoading(true);
                const data = await fetchLeaderboard();
                setLeaderboard(data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setError('Failed to load leaderboard');
            } finally {
                setLoading(false);
            }
        };
        getLeaderboard();
    }, []);

    const getMedalIcon = (rank) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return null;
        }
    };

    const userRank = leaderboard.findIndex(user => user.username === currentUser?.username) + 1;
    const currentUserData = leaderboard.find(user => user.username === currentUser?.username);

    if (loading) {
        return (
            <div className="leaderboard-card">
                <h3>Leaderboard</h3>
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
            <div className="leaderboard-card">
                <h3>Leaderboard</h3>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="leaderboard-card">
            <h3>Leaderboard</h3>
            <div className="leaderboard-header">
                <span className="header-user">User</span>
                <span className="header-score">Score</span>
            </div>
            <ul className="leaderboard-list">
                {leaderboard.slice(0, 5).map((user, index) => (
                    <li key={user.username} className='leaderboard-item'>
                        <div className="user-info">
                            <span className='rank'>{index + 1}</span>
                            <span className='medal'>{getMedalIcon(index + 1)}</span>
                            <span className='username'>{user.username}</span>
                        </div>
                        <span className='score'>{user.score}</span>
                    </li>
                ))}
            </ul>
            {currentUserData && userRank > 5 && (
                <div className="leaderboard-item current-user">
                    <div className="user-info">
                        <span className="rank">{userRank}</span>
                        <span className="username">{currentUserData.username}</span>
                    </div>
                    <span className="score">{currentUserData.score}</span>
                </div>
            )}
        </div>
    );
}

export default LeaderboardCard;