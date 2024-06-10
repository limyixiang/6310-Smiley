import React, { useState } from "react";
import { Helmet } from "react-helmet";
// import { Navigate } from 'react-router-dom';
import { forgetPasswordAuthentication } from "../Backend";
import styles from "./loginPage.module.css";

// ForgetPassword component for the forget password page
export function ForgetPassword() {
    const [inputValue, setInputValue] = useState({
        email: "",
        error: "",
        loading: false,
        success: false,
    });

    // Destructuring values from the state
    const { email, error, loading, success } = inputValue;

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
        // event.preventDefault();
        setInputValue({ ...inputValue, success: false, loading: true });

        // Placeholder for the forget password function calling the backend
        forgetPasswordAuthentication({ email })
            .then((data) => {
                if (data.error) {
                    setInputValue({
                        ...inputValue,
                        error: data.error,
                        success: false,
                        loading: false,
                    });
                } else {
                    setInputValue({ ...inputValue, success: true });
                }
            })
            .catch();
    };

    // Displays success message upon successful authorization of user
    const successMessage = () => {
        return (
            <div
                className={styles.successMessage}
                style={{ display: success ? "" : "none", color: "green" }}
            >
                <p>Check your email for the reset password link</p>
            </div>
        );
    };

    // Displays error message if there's any
    const errorMessage = () => {
        return (
            <div
                className={styles.errorMessage}
                style={{ display: error ? "" : "none", color: "red" }}
            >
                {error}
            </div>
        );
    };

    return (
        <div className={styles.mainContainer}>
            <Helmet>
                <link
                    href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
                    rel="stylesheet"
                />
            </Helmet>
            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>Forget Password</h2>
                {successMessage()}
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={handleInputChange("email")}
                        placeholder="Email"
                        required
                    />
                    <i class="bx bxs-envelope"></i>
                </div>
                {errorMessage()}
                <div>
                    <button
                        id="button"
                        className={styles.buttonGroup}
                        onClick={handleOnSubmit}
                        style={{ display: loading ? "none" : "block" }}
                    >
                        Submit
                    </button>
                    <div
                        className={styles.spinner}
                        id="spinner"
                        style={{ display: loading ? "block" : "none" }}
                    >
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading...</p>
                    </div>
                </div>
                <div className={styles.linkGroup}>
                    <a href="/signin">Back to Login</a>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
