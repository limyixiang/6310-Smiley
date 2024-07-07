import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { useLocation, useNavigate } from "react-router-dom";
import { profileChange } from "../Backend";
import styles from "./profilePage.module.css";
import "./colorPicker.module.css";

function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state;

    const [formValues, setFormValues] = useState({
        name: user ? user.name : "",
        error: false,
        success: false,
    });
    const { name, error, success } = formValues;

    const [colors, setColors] = useState({
        main: { hex: "#000055", rgb: { r: 0, g: 0, b: 85, a: 1 } },
        border: { hex: "#006eff", rgb: { r: 0, g: 110, b: 255, a: 0.3 } },
        background: { hex: "#c6e2ff", rgb: { r: 198, g: 226, b: 255, a: 1 } },
    });

    /*useEffect(() => {
        getColors({ userid: user._id })
            .then((data) => {
                setColors({
                    main: data.main,
                    border: data.border,
                    background: data.background,
                });
                updateCSS({
                    main: data.main,
                    border: data.border,
                    background: data.background,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [user._id]);*/

    const handleColorChange = (color, key) => {
        const newColors = {
            ...colors,
            [key]: color,
        };
        setColors(newColors);
        updateCSS(newColors);
    };

    const updateCSS = (colors) => {
        document.documentElement.style.setProperty(
            "--main-color",
            `rgba(${colors.main.rgb.r}, ${colors.main.rgb.g}, ${colors.main.rgb.b}, ${colors.main.rgb.a})`
        );
        document.documentElement.style.setProperty(
            "--border-color",
            `rgba(${colors.border.rgb.r}, ${colors.border.rgb.g}, ${colors.border.rgb.b}, ${colors.border.rgb.a})`
        );
        document.documentElement.style.setProperty(
            "--background-color",
            `rgba(${colors.background.rgb.r}, ${colors.background.rgb.g}, ${colors.background.rgb.b}, ${colors.background.rgb.a})`
        );
    };

    const setDefaultColors = () => {
        const defaultColors = {
            main: { hex: "#000055", rgb: { r: 0, g: 0, b: 85, a: 1 } },
            border: { hex: "#006eff", rgb: { r: 0, g: 110, b: 255, a: 0.3 } },
            background: {
                hex: "#c6e2ff",
                rgb: { r: 198, g: 226, b: 255, a: 1 },
            },
        };
        setColors(defaultColors);
        updateCSS(defaultColors);
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
            <div className={styles.headerGroup}>
                <h2>Hi, {user.name}</h2>
            </div>
            <div className={styles.formContainer}>
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
                    <button onClick={handleProfileUpdate}>Confirm</button>
                </form>
            </div>
            <div className={styles.colorContainer}>
                <div className={styles.colorPicker}>
                    <h2>Pick Colors</h2>
                    <SketchPicker
                        color={colors.main.rgb}
                        onChange={(color) =>
                            handleColorChange(
                                {
                                    ...colors.main,
                                    hex: color.hex,
                                    rgb: color.rgb,
                                },
                                "main"
                            )
                        }
                        disableAlpha={false}
                    />
                </div>
                <div className={styles.colorPicker}>
                    <h2>Pick Colors</h2>
                    <SketchPicker
                        color={colors.border}
                        onChange={(color) =>
                            handleColorChange(
                                {
                                    ...colors.main,
                                    hex: color.hex,
                                    rgb: color.rgb,
                                },
                                "border"
                            )
                        }
                        disableAlpha={false}
                    />
                </div>
                <div className={styles.colorPicker}>
                    <h2>Pick Colors</h2>
                    <SketchPicker
                        color={colors.background}
                        onChange={(color) =>
                            handleColorChange(
                                {
                                    ...colors.main,
                                    hex: color.hex,
                                    rgb: color.rgb,
                                },
                                "background"
                            )
                        }
                        disableAlpha={false}
                    />
                </div>
                <button onClick={setDefaultColors}>Default</button>
            </div>
            <div className={styles.linkGroup}>
                <button onClick={onLandingPage}>Back to Landing</button>
            </div>
        </div>
    );
}

export default ProfilePage;
