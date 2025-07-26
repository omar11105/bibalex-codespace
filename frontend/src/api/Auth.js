import axios from './axios';

// This file contains API calls related to user authentication

// These functions handle login and registration requests to the backend
export const login = async (email, password) => {
  try {
    const response = await axios.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
}

export const register = async (username, email, password, role) => {
  try {
    const response = await axios.post('/auth/register', { username, email, password, role });
    return response.data;
  } catch (error) {
    throw new Error('Registration failed. Please try again.');
  }
};