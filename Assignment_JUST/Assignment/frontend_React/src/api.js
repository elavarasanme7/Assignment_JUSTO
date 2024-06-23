import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const signup = async (data) => {
      return axios.post(`${API_URL}/auth/signup`, data);
};

export const login = async (data) => {
      return axios.post(`${API_URL}/auth/login`, data);
};

export const requestOneTimeLink = async (data) => {
    return axios.post(`${API_URL}/auth/onetime`, data);
};

export const validateToken = async (token) => {
    return axios.get(`${API_URL}/auth/validate`, {
        params: { token }
    });
};

