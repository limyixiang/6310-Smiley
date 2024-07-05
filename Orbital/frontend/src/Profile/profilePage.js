import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { profileChange } from "../Backend";
import styles from "./profilePage.module.css";

function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state;

    const onLandingPage = () => {
        navigate("/landingpage", { state: { user } });
    };

    const [formValues, setFormValues] = useState({
        name: user ? user.name : "",
        error: false,
        success: false,
    });

    const { name, error, success } = formValues;

    const handleInputChange = (name) => (event) => {
        setFormValues({
            ...formValues,
            error: false,
            success: false,
            [name]: event.target.value,
        });
    };

    // Updates the profile of the user
    const handleProfileSubmit = async (event) => {
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

        profileChange(name, user._id)
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
                }
            })
            .catch();
        navigate("/profilepage", { state: { user } });
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
            <div>
                <h2>Hi, {user.name}</h2>
            </div>
            <form>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Username</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleInputChange("name")}
                        placeholder="Name"
                        required
                    />
                </div>
                {successMessage()}
                {errorMessage()}
                <button onClick={handleProfileSubmit}>Confirm</button>
            </form>
            <div className={styles.linkGroup}>
                <button onClick={onLandingPage}>Back to Landing</button>
            </div>
        </div>
    );
}

export default ProfilePage;
