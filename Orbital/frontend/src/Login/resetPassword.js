import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { forgetPasswordReset } from '../Backend';

// ResetPassword component for the forget password page
export function ForgetPassword() {

    const [inputValue, setInputValue] = useState({
        email: '',
        password: '',
        password2: '',
        error: '',
        loading: false,
        success: false
    });

    // Destructuring values from the state
    const { email, password, password2, error, loading, success } = inputValue;

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
        event.preventDefault();

        // Both passwords do not match
        if (password !== password2) {
            setInputValue({ ...inputValue, error: "Passwords do not match", success: false, loading: false });
            return;
        }

        setInputValue({ ...inputValue, success: false, loading: true });

        // Placeholder for the forget password function calling the backend
        forgetPasswordReset({ email })
            .then(data => {
                if (data.error) {
                    setInputValue({ ...inputValue, error: data.error, success: false, loading: false });
                } else {
                    setInputValue({ ...inputValue, success: true });
                }
            })
            .catch();
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
        success ? <Navigate to="/signin" /> :
            <div className="form-container">
                <div className="form-box">
                    <h2>Reset Password</h2>
                    {loadingMessage()}
                    {errorMessage()}
                    <div className="form-group">
                        <label htmlFor="password">Enter your new password:</label>
                        <input id="password" type="password" value={password} onChange={handleOnChange("password")} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Re-enter your new password:</label>
                        <input id="password2" type="password" value={password2} onChange={handleOnChange("password2")} required />
                    </div>
                    <div className="form-group-button">
                        <button onClick={handleOnSubmit}>Reset Password</button>
                    </div>
                </div>
            </div>
    );
}
 
export default ForgetPassword;