import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/Config'; // Your Firebase configuration file
import { signInWithEmailAndPassword, sendPasswordResetEmail as firebaseSendPasswordResetEmail } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

// Create AuthContext
const AuthContext = React.createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component to provide authentication context to the entire app
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const sendPasswordResetEmail = (email) => {  
        return firebaseSendPasswordResetEmail(auth, email);
    };

    const logout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Failed to log out:', error.message);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch and set the username from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUsername(userDoc.data().username);
                } else {
                    console.log("No such document!");
                }
            } else {
                setUsername('');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        login,
        sendPasswordResetEmail,
        logout, // Include logout function in context value
        currentUser,
        loading,
        username,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

