import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { profileChange, signout } from "../Backend";
import styles from "./profilePage.module.css";
import "./colorPicker.module.css";

function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state;

    const [formValues, setFormValues] = useState({
        name: user ? user.name : "",
        theme: user ? user.colorTheme : "default",
        error: false,
        success: false,
    });
    const { name, theme, error, success } = formValues;

    const themes = {
        light: {
            "--mainText-color": "rgb(0, 0, 0)",
            "--pageBackground-color": "rgb(255, 255, 255)",
            "--elementBackground-color": "rgb(255, 255, 255)",
            "--border-color": "rgba(153, 153, 153, 0.4)",
            "--hover-color": "rgb(217, 217, 217)",
            "--focus-color": "rgb(211, 211, 211)",
        },
        dark: {
            "--mainText-color": "rgb(187, 187, 187)",
            "--pageBackground-color": "rgb(0, 0, 0)",
            "--elementBackground-color": "rgb(23, 23, 23)",
            "--border-color": "rgba(212, 212, 212, 0.4)",
            "--hover-color": "grey",
            "--focus-color": "rgb(67, 67, 67)",
        },
        default: {
            "--mainText-color": "rgb(0, 0, 66)",
            "--pageBackground-color": "#d8f5fd",
            "--elementBackground-color": "rgb(241, 253, 255)",
            "--border-color": "rgba(71, 180, 230, 0.4)",
            "--hover-color": "#c5edff",
            "--focus-color": "rgba(118, 198, 235, 0.4)",
        },
        green: {
            "--mainText-color": "rgb(0, 66, 17)",
            "--pageBackground-color": "rgb(199, 228, 207)",
            "--elementBackground-color": "rgb(241, 255, 245)",
            "--border-color": "rgba(0, 160, 35, 0.4)",
            "--hover-color": "rgb(210, 246, 219)",
            "--focus-color": "rgba(0, 178, 118, 0.483)",
        },
        pink: {
            "--mainText-color": "rgb(51, 0, 48)",
            "--pageBackground-color": "#fff2fa",
            "--elementBackground-color": "rgb(255, 254, 255)",
            "--border-color": "rgba(255, 139, 249, 0.4)",
            "--hover-color": "#fee1ff",
            "--focus-color": "rgba(235, 149, 224, 0.4)",
        },
    };

    const changeTheme = (themeName) => {
        const selectedTheme = themes[themeName];
        setFormValues({
            ...formValues,
            theme: themeName,
        });
        for (const key in selectedTheme) {
            document.documentElement.style.setProperty(key, selectedTheme[key]);
        }
    };

    const onLandingPage = () => {
        navigate("/landingpage", { state: { user } });
    };

    const handleInputChange = (name) => (event) => {
        setFormValues({
            ...formValues,
            error: false,
            success: false,
            [name]: event.target.value,
        });
    };

    // Updates the profile of the user
    const handleProfileUpdate = async (event) => {
        event.preventDefault();

        if (name === "") {
            setFormValues({
                ...formValues,
                error: "Name cannot be empty!",
            });
            return;
        }

        setFormValues({
            ...formValues,
            error: false,
        });

        profileChange(user._id, name, theme)
            .then((data) => {
                if (data.error) {
                    setFormValues({
                        ...formValues,
                        error: data.error,
                    });
                } else {
                    setFormValues({
                        ...formValues,
                        name: "",
                        success: true,
                        error: false,
                    });
                    navigate("/profilepage", { state: { user } });
                }
            })
            .catch();
    };

    const onSignout = () => {
        signout(); // Perform signout action
        console.log("Signed out");
        navigate("/signin"); // Redirect to login page after sign out
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

    const successMessage = () => {
        return (
            success && (
                <div
                    className={styles.successMessage}
                    style={{ display: success ? "" : "none", color: "green" }}
                >
                    Profile updated successfully, please relogin to see changes.
                </div>
            )
        );
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.headerGroup}>
                <h2>Hi, {user.name}</h2>
            </div>
            <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">CHANGE YOUR USERNAME:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleInputChange("name")}
                        placeholder="Username"
                        required
                    />
                </div>
            </div>
            <div className={styles.colorContainer}>
                <p>CHANGE THEME:</p>
                <button onClick={() => changeTheme("default")}>
                    Default Blue
                </button>
                <button onClick={() => changeTheme("light")}>Light</button>
                <button onClick={() => changeTheme("dark")}>Dark</button>
                <button onClick={() => changeTheme("green")}>Green</button>
                <button onClick={() => changeTheme("pink")}>Pink</button>
            </div>
            {successMessage()}
            {errorMessage()}
            <div className={styles.buttonGroup}>
                <button onClick={handleProfileUpdate}>Update Profile</button>
            </div>
            <div className={styles.linkGroup}>
                <button onClick={onLandingPage}>Back to Landing</button>
                <button onClick={onSignout}>Sign Out</button>
            </div>
        </div>
    );
}

export default ProfilePage;
