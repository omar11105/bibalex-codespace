import axios from './axios';

// This file contains API calls related to the leaderboard
export const fetchLeaderboard = async () => {
  try {
    const response = await axios.get('/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};