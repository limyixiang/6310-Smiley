import React from 'react';
import { isAuthenticated, signout } from '../Backend';
import { useNavigate, Link } from 'react-router-dom';
import './dashboard.css'

const Dashboard = () => {
    const navigate = useNavigate(); // Initialize navigation
    const authenticatedUser = isAuthenticated(); // Check if the user is authenticated

    // Function to handle signout action
    const onSignout = () => {
        signout(); // Perform signout action
        console.log("Signed out");
        navigate('/signin'); // Redirect to login page after sign out
    };

    return (
        !authenticatedUser ? 
        <h1 className='dashboard-prelogin'>
            Welcome to Smiley :D, please login <a href='/signin'>here</a>!
        </h1> :
        <div className='dashboard-postlogin'>
            <h1>Hello, {authenticatedUser.user.name}</h1>
            <button onClick={onSignout}>Sign Out</button>
            <Link to="/landingpage" state={{ user: authenticatedUser.user }}>
                <button>Landing Page</button>
            </Link>
        </div>
    );
    
};

export default Dashboard;