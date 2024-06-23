import React, { useState } from 'react';
import { requestOneTimeLink } from '../api';

const OneTimeLink = () => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await requestOneTimeLink({ emailOrPhone });
            setMessage(response.data.link);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Request One-Time Link</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="Email or Phone" required />
                <button type="submit">Request Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default OneTimeLink;

