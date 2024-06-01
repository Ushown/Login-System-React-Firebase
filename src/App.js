
import { useEffect, useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from './auth/AuthContext';
import { auth } from './firebase/Config'
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard';
import PasswordReset from './components/PasswordReset';
import PasswordUpdate from './components/PasswordUpdate';
// import PrivateRoute from './components/PrivateRoute';
import Error from "./pages/Error"
import SharedLayout from './pages/SharedLayout';


function App() {
      // State to hold the current user
      const [currentUser, setCurrentUser] = useState(null);

      useEffect(() => {
          // Listen for authentication state changes
          const unsubscribe = auth.onAuthStateChanged((user) => {
              setCurrentUser(user);
          });
  
          // Clean up subscription on unmount
          return unsubscribe;
      }, []);

  return (    
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ <SharedLayout/> }>
            <Route index element={ <Home/> } />
            <Route path="/dashboard" element={ <Dashboard/>} />
            {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */} 
            <Route path="/register" element={ <Register/> } />
            <Route path="/login" element={ <Login/> } />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/password-update/:oobCode" element={<PasswordUpdate />} />            
            <Route path="*" element={ <Error /> } />
          </Route>          
        </Routes>  
      </AuthProvider>  
    </BrowserRouter>  
  );
}

export default App;
