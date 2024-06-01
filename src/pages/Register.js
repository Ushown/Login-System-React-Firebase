import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  //
import { db, auth } from '../firebase/Config';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordAgain: ''
    });
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        passwordAgain: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            passwordAgain: ''
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let valid = true;

        const { username, email, password, passwordAgain } = formData;
        const newErrors = {
            username: '',
            email: '',
            password: '',
            passwordAgain: ''
        };

        // Validation checks
        if (!username) {
            newErrors.username = 'Username is required';
            valid = false;
        }

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Invalid email format';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        if (!passwordAgain) {
            newErrors.passwordAgain = 'Please confirm your password';
            valid = false;
        } else if (password !== passwordAgain) {
            newErrors.passwordAgain = 'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) return;

        try {
            const usersCollection = collection(db, 'users');
            const usernameQuery = query(usersCollection, where('username', '==', username));
            const emailQuery = query(usersCollection, where('email', '==', email));

            const [usernameSnapshot, emailSnapshot] = await Promise.all([
                getDocs(usernameQuery),
                getDocs(emailQuery)
            ]);

            if (!usernameSnapshot.empty) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    username: 'Username already exists'
                }));
                return;
            }

            if (!emailSnapshot.empty) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Email already exists'
                }));
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile with displayName
            await updateProfile(user, {
                displayName: username
            });

            // Add user details to Firestore
            await setDoc(doc(usersCollection, user.uid), {
                uid: user.uid,
                username,
                email
            });

            resetForm();

            navigate('/dashboard')  //
        } catch (err) {
            console.error('Error:', err);
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: err.message.includes('email') ? err.message : prevErrors.email,
                password: err.message.includes('password') ? err.message : prevErrors.password
            }));
        }
    };
    // const history = useHistory()  //

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="text" // Change input type to text to disable browser email validation
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
            </div>
            <div>
                <label htmlFor="passwordAgain">Password Again</label>
                <input
                    type="password"
                    id="passwordAgain"
                    name="passwordAgain"
                    value={formData.passwordAgain}
                    onChange={handleChange}
                />
                {errors.passwordAgain && <p style={{ color: 'red' }}>{errors.passwordAgain}</p>}
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
