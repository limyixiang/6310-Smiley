import React, { useState } from "react";
import { forgetPasswordReset } from "../Backend";
import "./resetPassword.css";

// ResetPassword component for the forget password page
export function ForgetPassword() {
    const [inputValue, setInputValue] = useState({
        password: "",
        password2: "",
        error: "",
        loading: false,
        success: false,
    });

    // Destructuring values from the state
    const { password, password2, error, loading, success } = inputValue;

    // Handles changes in the input fields
    const handleInputChange = (name) => (event) => {
        setInputValue({
            ...inputValue,
            error: false,
            [name]: event.target.value,
        });
    };

    // Submits the form data to the backend
    const handleOnSubmit = async (event) => {
        event.preventDefault();

        // Both passwords do not match
        if (password !== password2) {
            setInputValue({
                ...inputValue,
                error: "Passwords do not match.",
                success: false,
                loading: false,
            });
            return;
        }

        setInputValue({ ...inputValue, success: false, loading: true });

        // Get the token from the URL
        const token = window.location.pathname.split("/").pop();

        // Placeholder for the forget password function calling the backend
        forgetPasswordReset({ password }, token)
            .then((data) => {
                if (data.error) {
                    setInputValue({
                        ...inputValue,
                        error: data.error,
                        success: false,
                        loading: false,
                    });
                } else {
                    setInputValue({
                        ...inputValue,
                        password: "",
                        password2: "",
                        success: true,
                    });
                }
            })
            .catch();
    };

    // Displays error message if there's any
    const errorMessage = () => {
        return (
            <div
                className="error-message"
                style={{ display: error ? "" : "none", color: "red" }}
            >
                {error}
            </div>
        );
    };

    // Displays success message upon successful reset of password
    const successMessage = () => {
        return (
            <div
                className="success-message"
                style={{ display: success ? "" : "none", color: "green" }}
            >
                <p>
                    Password has been reset successfully. Please proceed to{" "}
                    <a href="/signin">login</a>.
                </p>
            </div>
        );
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h2>Reset Password</h2>
                {successMessage()}
                <div className="form-group">
                    <label htmlFor="password">Enter your new password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handleInputChange("password")}
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">
                        Re-enter your new password:
                    </label>
                    <input
                        id="password2"
                        type="password"
                        value={password2}
                        onChange={handleInputChange("password2")}
                        placeholder="Re-enter password"
                        required
                    />
                </div>
                <p className="password-requirements">
                    Password should contain at least 8 characters, with at least
                    1 uppercase, 1 lowercase and 1 number.
                </p>
                {errorMessage()}
                <div className="form-button">
                    <button
                        id="button"
                        className="button"
                        onClick={handleOnSubmit}
                        style={{ display: loading ? "none" : "block" }}
                    >
                        Reset Password
                    </button>
                    <div
                        className="spinner"
                        id="spinner"
                        style={{ display: loading ? "block" : "none" }}
                    >
                        <div className="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                </div>
                <div className="link">
                    <center>
                        <p className="resetpassword-to-login">
                            <b>
                                <a href="/signin">Back to Login</a>
                            </b>
                        </p>
                    </center>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
