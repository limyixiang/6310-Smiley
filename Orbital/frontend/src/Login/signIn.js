import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { signin, authenticate } from "../Backend";
import { Navigate } from "react-router-dom";
import styles from "./loginPage.module.css";

// Signin component for the login form
export function Signin() {
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
    const handleInputChange = (name) => (event) => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    // Submits the form data to the backend for user authentication & loads when click
    const onSubmit = async (event) => {
        event.preventDefault();
        setValues({ ...values, success: false, loading: true });
        signin({ email, password })
            .then((data) => {
                if (data.error) {
                    setValues({
                        ...values,
                        error: data.error,
                        loading: false,
                        success: false,
                    });
                } else {
                    authenticate(data, () => {
                        setValues({ ...values, success: true });
                    });
                }
            })
            .catch();
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

    // Configures the sign-in page
    return success ? (
        <Navigate to="/" />
    ) : (
        <div className={styles.mainContainer}>
            <Helmet>
                <link
                    href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
                    rel="stylesheet"
                />
            </Helmet>
            <div className={styles.formContainer}>
                <form action="">
                    <h2 className={styles.formTitle}>Login</h2>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange("email")}
                            placeholder="Email"
                            required
                        />
                        <i class="bx bxs-user"></i>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleInputChange("password")}
                            placeholder="Password"
                            required
                        />
                        <i class="bx bxs-lock-alt"></i>
                    </div>
                    {errorMessage()}
                    <div className={styles.linkGroup}>
                        <a href="/signup"> Sign Up</a>
                    </div>
                    <div className={styles.linkGroup}>
                        <a href="/forgetpassword"> Forget Password</a>
                    </div>
                    <div>
                        <button
                            id="button"
                            className={styles.buttonGroup}
                            onClick={onSubmit}
                            style={{ display: loading ? "none" : "block" }}
                        >
                            Login
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
                </form>
            </div>
        </div>
    );
}

export default Signin;
