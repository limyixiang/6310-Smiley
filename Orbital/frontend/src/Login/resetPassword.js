import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { forgetPasswordReset } from "../Backend";
import styles from "./loginPage.module.css";
import logo from "../smileytransparent.jpg";

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
                className={styles.errorMessage}
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
                className={styles.successMessage}
                style={{ display: success ? "" : "none", color: "green" }}
            >
                Password has been reset successfully. Please proceed to login{" "}
                <a href="/signin">here</a>.
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
                    <h2 className={styles.formTitle}>Reset Password</h2>
                    {successMessage()}
                    <div className={styles.formGroup}>
                        <label htmlFor="password">
                            Enter your new password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handleInputChange("password")}
                            placeholder="Password"
                            required
                        />
                        <i class="bx bxs-lock-alt"></i>
                    </div>
                    <div className={styles.formGroup}>
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
                        <i class="bx bxs-lock-alt"></i>
                    </div>
                    <p className={styles.passwordRequirements}>
                        Password should contain at least 8 characters, with at
                        least 1 uppercase, 1 lowercase and 1 number.
                    </p>
                    {errorMessage()}
                    <div className={styles.buttonGroup}>
                        <button
                            id="button"
                            onClick={handleOnSubmit}
                            style={{ display: loading ? "none" : "block" }}
                        >
                            Reset Password
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
