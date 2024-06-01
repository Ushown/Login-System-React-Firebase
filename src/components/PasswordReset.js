import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { sendPasswordResetEmail } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await sendPasswordResetEmail(email);
            setMessage('Password reset email sent. Please check your inbox.');
        } catch (error) {
            setError('Failed to send password reset email. Please try again.');
        }
    };

    return (
        <div>
            <h2>Password Reset</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Send Password Reset Email</button>
            </form>
        </div>
    );
};

export default PasswordReset;
