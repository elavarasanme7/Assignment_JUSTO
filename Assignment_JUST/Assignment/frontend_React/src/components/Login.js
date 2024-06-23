import React, { useState } from 'react';
import { login } from '../api'; 
import { saveToken } from '../utils'; 
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin = () => {} }) => { 
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); 
        try {
            console.log('Submitting login form with data:', formData);
            const response = await login(formData); 
            console.log('API response:', response);

            if (response.data && response.data.token) {
                saveToken(response.data.token); 
                onLogin(); 
                setMessage('Login successful. Redirecting to dashboard...');
                setTimeout(() => {
                    navigate('/dashboard'); 
                }, 2000); 
            } else {
                setMessage('Unexpected response format from server. Please try again.');
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    setMessage('Invalid username or password.');
                } else {
                    setMessage(`Error: ${error.response.data.message || 'Unexpected error occurred.'}`);
                }
            } else if (error.request) {
                console.error('Error request details:', error.request);
                setMessage('Network error');
            } else {
                console.error('Unexpected error:', error.message);
                setMessage('Unexpected error occurreD');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="username">Username:</label><br />
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="password">Password:</label><br />
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Login</button>
            </form>
            {message && <p style={{ marginTop: '10px', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
};

export default Login;
