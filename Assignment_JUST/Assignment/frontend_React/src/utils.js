import { jwtDecode } from 'jwt-decode';

export const saveToken = (token) => {
    
    localStorage.setItem('authToken', token);
    console.log(token)
    
};

export const getToken = () => {
    return localStorage.getItem('authToken');
};

export const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        return null;
    }
};

export const isTokenValid = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return false;
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};

export const logout = () => {
    localStorage.removeItem('authToken');
};
