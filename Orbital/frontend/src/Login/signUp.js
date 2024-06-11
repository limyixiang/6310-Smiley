import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { signup } from "../Backend";
import styles from "./loginPage.module.css";
import logo from "./smileytransparent.jpg";

// Signup component for the signup form
function Signup() {
    const [formValues, setFormValues] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
        error: "",
        loading: false,
        success: false,
    });

    // Destructuring values from the state
    const { name, email, password, confirmPassword, error, loading, success } =
        formValues;

    const [isShaking, setShaking] = useState(false); // State for shaking animation

    // Handles changes in the input fields
    const handleInputChange = (name) => (event) => {
        setFormValues({
            ...formValues,
            error: false,
            [name]: event.target.value,
        });
    };

    // Submits the form data to the backend
    const onSubmit = async (event) => {
        event.preventDefault();

        // Passwords do not match
        if (password !== confirmPassword) {
            setFormValues({
                ...formValues,
                error: "Passwords do not match",
                success: false,
                loading: false,
            });
            return;
        }

        setFormValues({ ...formValues, success: false, loading: true });

        // Placeholder for the signup function calling the backend
        signup({ name, email, password })
            .then((data) => {
                if (data.error) {
                    setFormValues({
                        ...formValues,
                        error: data.error,
                        loading: false,
                        success: false,
                    });
                } else {
                    setFormValues({ ...formValues, success: true });
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

    // Displays success message upon successful form submission
    const successMessage = () => {
        return (
            success && (
                <div
                    className={styles.successMessage}
                    style={{ display: success ? "" : "none", color: "black" }}
                >
                    <p className={styles.linkGroup}>
                        Account created successfully, login{" "}
                        <b>
                            <a href="/signin">here</a>
                        </b>
                        .
                    </p>
                </div>
            )
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
                    <h2 className={styles.formTitle}>Create an account</h2>
                    {successMessage()}
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Username</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleInputChange("name")}
                            placeholder="Name"
                            required
                        />
                        <i class="bx bxs-user"></i>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            onChange={handleInputChange("email")}
                            placeholder="Email"
                            required
                        />
                        <i class="bx bxs-envelope"></i>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleInputChange("password")}
                            placeholder="Password"
                            required
                        />
                        <i class="bx bxs-lock-alt"></i>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">
                            Re-enter your password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={handleInputChange("confirmPassword")}
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
                    <div>
                        <button
                            id="button"
                            className={styles.buttonGroup}
                            onClick={onSubmit}
                            style={{ display: loading ? "none" : "block" }}
                        >
                            Sign Up
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
                        <a href="/signin"> Back to Login</a>
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

export default Signup;
