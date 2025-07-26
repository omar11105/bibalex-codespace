import axios from './axios';

// This file contains API calls related to submission management

// These functions handle fetching recent submissions and submitting code
export const fetchRecentSubmissions = async (candidateId) => {
    try {
        const response = await axios.get(`/candidate/${candidateId}/submissions?limit=5`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent submissions:', error);
        return [];
    }
};

export const submitCode = async (submissionData) => {
    try {
        const response = await axios.post('/candidate/submissions', submissionData);
        return response.data;
    } catch (error) {
        console.error('Error submitting code:', error);
        throw new Error('Failed to submit code');
    }
};