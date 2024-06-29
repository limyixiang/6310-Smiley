import React, { useState } from "react";
import { Helmet } from "react-helmet";
// import { Navigate } from 'react-router-dom';
import { forgetPasswordAuthentication } from "../Backend";
import styles from "./loginPage.module.css";
import logo from "./smileytransparent.jpg";

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

    const [isShaking, setShaking] = useState(false); // State for shaking animation

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
        setInputValue({ ...inputValue, success: false, loading: true });

        // Placeholder for the forget password function calling the backend
        forgetPasswordAuthentication({ email: email.toLowerCase() })
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
    const handleClick = (e) => {
        const rippleContainer = e.currentTarget;
        const rippleSize = 30; // Adjust the size of the ripple
        const numRipples = 2; // Number of ripples
        const delay = 250; // Delay between each ripple

        for (let i = 0; i < numRipples; i++) {
            setTimeout(() => {
                const ripple = document.createElement("div");
                ripple.classList.add(styles.ripple);
                ripple.style.width = ripple.style.height = `${rippleSize}px`;
                ripple.style.left = `${
                    e.clientX -
                    rippleContainer.getBoundingClientRect().left -
                    rippleSize / 2
                }px`;
                ripple.style.top = `${
                    e.clientY -
                    rippleContainer.getBoundingClientRect().top -
                    rippleSize / 2
                }px`;
                rippleContainer.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 1000); // Adjust this value to match the animation duration
            }, i * delay);
        }
    };
    const handleSmileyClick = () => {
        setShaking(true);
        setTimeout(() => {
            setShaking(false);
        }, 3000); // Adjust this value to match the animation duration
    };
    return (
        <div className={styles.mainContainer}>
            <Helmet>
                <link
                    href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
                    rel="stylesheet"
                />
            </Helmet>
            <div className={styles.rippleContainer} onClick={handleClick}>
                <div className={styles.ripple}></div>
            </div>
            <div className={styles.formContainer}>
                <form>
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
                    <div className={styles.buttonGroup}>
                        <button
                            id="button"
                            onClick={handleOnSubmit}
                            style={{ display: loading ? "none" : "block" }}
                        >
                            Submit
                        </button>
                        <div
                            className={styles.spinnerGroup}
                            id="spinner"
                            style={{ display: loading ? "block" : "none" }}
                        >
                            <div className={styles.spinner}></div>
                            <p>Loading...</p>
                        </div>
                    </div>
                    <div className={styles.linkGroup}>
                        <a href="/signin">Back to Login</a>
                    </div>
                </form>
            </div>
            <div className={styles.logoContainer}>
                <img
                    src={logo}
                    alt="SmileyLogo"
                    className={isShaking ? styles.logoShake : styles.logo}
                    onClick={handleSmileyClick}
                />
                <h1>SMILEY</h1>
            </div>
            <a
                className={styles.attributionGroup}
                href="https://www.vecteezy.com/free-vector/mountain"
            >
                Mountain Vectors by Vecteezy
            </a>
        </div>
    );
}

export default ForgetPassword;
