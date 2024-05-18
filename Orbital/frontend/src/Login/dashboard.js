import React from 'react';
import { isAuthenticated, signout } from '../Backend';
import { useNavigate } from 'react-router-dom';

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
        !authenticatedUser ? <h1>Welcome to Smiley :D, please login <a href='/signin'>here</a>!</h1>:
            <div className='dashboard'>
                <button onClick={onSignout}>Sign Out</button>
                <h1>Hello, {authenticatedUser.user.name}, to go to the landing page, click <a href = '/landingpage'>here</a>!</h1> {/* Display user's name */}
            </div>
    );
};

export default Dashboard;