import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, confirmPasswordReset } from 'firebase/auth';

const PasswordUpdate = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [oobCode, setOobCode] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const auth = getAuth();

    useEffect(() => {
        const code = searchParams.get('oobCode');
        if (code) {
            setOobCode(code);
        } else {
            setError('Invalid or expired reset code');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, password);
            setMessage('Password has been reset successfully');
            setError('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage('');
            setError(`Failed to reset password: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Set New Password</h2>



            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Update Password</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default PasswordUpdate;
