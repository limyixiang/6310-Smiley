import React, { useState } from 'react';
import { signin, authenticate } from '../Backend';
import { Navigate } from 'react-router-dom'; 
import "./signIn.css"

// Signin component for the login form
export function Signin(){

    // Initializing states for form fields, error, loading, and success messages
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        success: false,
    });

    // Destructuring values from the state
    const { email, password, error, loading, success } = values;
    
    // Handles changes in the input fields
    const handleInputChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    }

    // Submits the form data to the backend for user authentication & loads when click
    const onSubmit = async event => {
        event.preventDefault();
        setValues({ ...values, success: false, loading: true });
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false, success: false });
                } else {
                    authenticate(data, () => {
                        setValues({ ...values, success: true });
                    })
                }
            })
            .catch();
    }

    // Displays error message if there's any
    const errorMessage = () => {
        return (<div className='error-message' style={{ display: error ? "" : "none", color: "red" }}>
            {error}
        </div>);
    }

    // Configures the sign-in page
    return (
        success ? <Navigate to="/" /> :
            <div className='form-container'>
                <div className='form-box'>
                    <h2>Login</h2> 
                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" value={email} onChange={handleInputChange("email")} placeholder='Email' required />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={handleInputChange("password")} placeholder='Password' required />
                    </div>
                    {errorMessage()}
                    <div className='link'>
                        <center><p className='login-to-signup'><b><a href='/signup'> Sign Up</a></b></p></center>
                    </div>
                    <div className='link'>
                        <center><p className='login-to-forgetpassword'><b><a href='/forgetpassword'> Forget Password</a></b></p></center>
                    </div>
                    <div className="form-button">
                        <button id='button' className ='button' onClick={onSubmit} style={{ display: loading ? 'none' : 'block' }}>Login</button>
                        <div className="spinner" id='spinner'style={{ display: loading ? 'block' : 'none' }}>
                            <div className="loading-spinner"></div>
                            <p>Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Signin;
