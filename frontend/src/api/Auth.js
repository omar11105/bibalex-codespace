import axios from './axios';

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

export const resendVerification = async (email) => {
  try {
    const response = await axios.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    throw new Error('Failed to resend verification email.');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send password reset email.');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw new Error('Failed to reset password.');
  }
};

export const validateResetToken = async (token) => {
  try {
    const response = await axios.get(`/auth/validate-reset-token?token=${token}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to validate reset token.');
  }
};