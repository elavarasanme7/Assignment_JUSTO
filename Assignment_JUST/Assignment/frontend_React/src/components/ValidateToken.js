import React, { useState, useEffect } from 'react';
import { validateToken } from '../api';
import { saveToken } from '../utils';
import { useNavigate } from 'react-router-dom';

const ValidateToken = ({ location }) => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        const validate = async () => {
            try {
                const response = await validateToken(token);
                saveToken(response.data.token);
                navigate('/dashboard');
            } catch (error) {
                setMessage(error.response.data.message);
            }
        };
        validate();
    }, [token, navigate]);

    return (
        <div>
            <h2>Validating...</h2>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ValidateToken;
