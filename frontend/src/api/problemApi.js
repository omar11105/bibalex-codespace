import axios from './axios';

// This file contains API calls related to the problem management

// These functions handle fetching current problem, problem bank, and individual problems
export const fetchCurrentProblem = async () => {
    try {
        const res = await axios.get('/candidate/current-problem');
        return res.data;
    } catch (error) {
        console.error('Error fetching current problem:', error);
        throw new Error('Failed to fetch current problem');
    }
};

export const fetchProblemBank = async () => {
    try {
        const res = await axios.get('/problems');
        return res.data;
    } catch (error) {
        console.error('Error fetching problem bank:', error);
        throw new Error('Failed to fetch problem bank');
    }
};

export const fetchProblemById = async (id) => {
    try {
        const res = await axios.get(`/problems/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching problem:', error);
        throw new Error('Failed to fetch problem');
    }
};
