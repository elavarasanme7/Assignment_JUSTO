import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Protected() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/protected', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMessage(response.data);
            } catch (error) {
                if (error.response) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('Server error');
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Protected Route</h2>
            <p>{message}</p>
        </div>
    );
}

export default Protected;
