import { React, useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./feedbackPage.module.css";
import { submitFeedback, getColorTheme } from "../Backend";
import logo from "../smileytransparent.jpg";

function FeedbackPage() {
    const location = useLocation();
    const { user } = location.state;

    const [feedbackDetails, setFeedbackDetails] = useState({
        userid: user._id,
        feedbackType: "",
        feedbackTitle: "",
        feedbackMessage: "",
    });
    const { feedbackType, feedbackTitle, feedbackMessage } = feedbackDetails;

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const themes = useMemo(
        () => ({
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
                "--elementBackground-color": "rgb(248, 254, 255)",
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
        }),
        []
    );

    useEffect(() => {
        const setThemeColor = (themeName) => {
            const selectedTheme = themes[themeName];
            for (const key in selectedTheme) {
                document.documentElement.style.setProperty(
                    key,
                    selectedTheme[key]
                );
            }
        };

        getColorTheme({ userid: user._id })
            .then((data) => {
                setThemeColor(data.data);
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, [user._id, themes]);

    const handleChange = (e) => {
        setSuccess(false);
        setError(false);
        const { name, value } = e.target;
        setFeedbackDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (
            feedbackType === "" ||
            feedbackTitle === "" ||
            feedbackMessage === ""
        ) {
            setError("Please fill in all fields!");
            return;
        }

        submitFeedback(feedbackDetails).then((response) => {
            if (response) {
                setSuccess(true);
            }
        });
        setFeedbackDetails((prevState) => ({
            ...prevState,
            feedbackType: "",
            feedbackTitle: "",
            feedbackMessage: "",
        }));
    };

    const navigate = useNavigate();

    const onLandingPage = () => {
        navigate("/landingpage", { state: { user } });
    };

    const successMessage = () => {
        return (
            success && (
                <div
                    className={styles.successMessage}
                    style={{ display: success ? "" : "none", color: "green" }}
                >
                    Feedback submitted successfully! Thank you for your
                    feedback!
                    <img
                        src={logo}
                        alt="SmileyLogo"
                        style={{
                            width: "5%",
                            height: "5%",
                            marginLeft: "10px",
                        }}
                    />
                </div>
            )
        );
    };

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
            <div className={styles.headerGroup}>
                <h2>Leave us a Feedback!</h2>
            </div>
            <div className={styles.feedbackContainer}>
                {/* Feedback Type Dropdown */}
                <div className={styles.feedbackItem}>
                    <label htmlFor="feedbackType">Feedback Type:</label>
                    <select
                        name="feedbackType"
                        id="feedbackType"
                        required
                        value={feedbackType}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>
                            --Please choose an option--
                        </option>
                        <option value="Bug Issue">Bug Issue</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Suggestions">Suggestions</option>
                    </select>
                </div>

                {/* Feedback Title */}
                <div className={styles.feedbackItem}>
                    <label htmlFor="feedbackTitle">Feedback Title:</label>
                    <input
                        type="text"
                        name="feedbackTitle"
                        id="feedbackTitle"
                        placeholder="Title of your feedback"
                        required
                        value={feedbackTitle}
                        onChange={handleChange}
                    />
                </div>

                {/* Feedback Message */}
                <div className={styles.feedbackItem}>
                    <label htmlFor="feedbackMessage">Feedback Message:</label>
                    <textarea
                        name="feedbackMessage"
                        id="feedbackMessage"
                        placeholder="Enter your feedback here..."
                        required
                        value={feedbackMessage}
                        onChange={handleChange}
                    ></textarea>
                </div>
                {successMessage()}
                {errorMessage()}
            </div>
            <div className={styles.buttonGroup}>
                <button onClick={onSubmit}>Submit</button>
            </div>
            <div className={styles.linkGroup}>
                <button onClick={onLandingPage}>Back to Landing Page</button>
            </div>
        </div>
    );
}

export default FeedbackPage;
