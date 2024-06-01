
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from '../auth/AuthContext';
import "./Navbar.css"

const Navbar = () => {
    const { logout, currentUser, username } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out:', error.message);
        }
    };

    return <header> 
        <nav>
            <NavLink to="/">Home</NavLink>
            {!currentUser && (
                <>
                    <NavLink to="/register">Register</NavLink>
                    <NavLink to="/login">Login</NavLink>
                </>
            )}
            {currentUser && (
                <>  
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <button onClick={handleLogout}>Logout</button>
                    <span className="navbar-username">Hi, {username}</span>
                </>
            )}
        </nav>
    </header>   
}

export default Navbar