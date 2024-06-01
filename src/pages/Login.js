import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            handleFirebaseError(error);
        }
    };

    const handleFirebaseError = () => {        
        setErrors({ general: 'Invalid email or password' });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Forgot your password? <Link to="/password-reset">Reset Password</Link>
            </p>
        </div>
    );
};

export default Login;
