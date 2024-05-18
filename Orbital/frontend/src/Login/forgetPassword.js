import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';
import { forgetPasswordAuthentication } from '../Backend';

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
            <div className="success-message" style={{ display: success ? "" : "none" }}>
                <p>Check your email for the reset password link</p>
            </div>
        );
    }

    // Displays error message if there's any
    const errorMessage = () => {
        return (
            <div className="error-message" style={{ display: error ? "" : "none" }}>
                {error}
            </div>
        );
    }

    // Displays loading message during form submission
    const loadingMessage = () => {
        return (
            <div className="loading-message" style={{ display: loading ? "" : "none" }}>
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="form-container">
            <div className="form-box">
                <h2>Forget Password</h2>
                {successMessage()}
                {loadingMessage()}
                {errorMessage()}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="text" value={email} onChange={handleOnChange("email")} required />
                </div>
                <div className="form-group-button">
                    <button onClick={handleOnSubmit}>Submit</button>
                </div>
                <div className='login-message'>
                        <center><p className='login_redirect mt-2'><b><a href='/signin'>Back to Login</a></b></p></center>
                </div>
            </div>
        </div>
    );
}
 
export default ForgetPassword;