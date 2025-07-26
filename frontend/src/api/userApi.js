import axios from './axios';

// This file contains API calls related to user management

// This function fetches a candidate's details by their ID
export const fetchCandidateById = async (id) => {
  try {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return null;
  }
};
