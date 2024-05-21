import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';
import { forgetPasswordAuthentication } from '../Backend';
import "./forgetPassword.css"

// ForgetPassword component for the forget password page
export function ForgetPassword() {

    const [inputValue, setInputValue] = useState({
        email: '',
        error: '',
        loading: false,
        success: false
    });

    // Destructuring values from the state
    const { email, error, loading, success } = inputValue;

    // Handles changes in the input fields
    const handleOnChange = name => event => {
        setInputValue({
            ...inputValue,
            error: false,
            [name]: event.target.value
        });
    }

    // Submits the form data to the backend
    const handleOnSubmit = async event => {
        // event.preventDefault();
        setInputValue({ ...inputValue, success: false, loading: true });

        // Placeholder for the forget password function calling the backend
        forgetPasswordAuthentication({ email })
            .then(data => {
                if (data.error) {
                    setInputValue({ ...inputValue, error: data.error, success: false, loading: false });
                } else {
                    setInputValue({ ...inputValue, success: true });
                }
            })
            .catch();
    }

    // Displays success message upon successful authorization of user
    const successMessage = () => {
        return (
            <div className="success-message" style={{ display: success ? "" : "none", color: "green" }}>
                <p>Check your email for the reset password link</p>
            </div>
        );
    }

    // Displays error message if there's any
    const errorMessage = () => {
        return (
            <div className="error-message" style={{ display: error ? "" : "none", color: "red" }}>
                {error}
            </div>
        );
    }

    return (
        <div className="form-container">
            <div className="form-box">
                <h2>Forget Password</h2>
                {successMessage()}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="text" value={email} onChange={handleOnChange("email")} placeholder='Email' required />
                </div>
                {errorMessage()}
                <div className="form-button">
                    <button id='button' className ='button' onClick={handleOnSubmit} style={{ display: loading ? 'none' : 'block' }}>Submit</button>
                    <div className="spinner" id='spinner' style={{ display: loading ? 'block' : 'none' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                </div>
                <div className='link'>
                        <center><p className='forgetpassword-to-login'><b><a href='/signin'>Back to Login</a></b></p></center>
                </div>
            </div>
        </div>
    );
}
 
export default ForgetPassword;