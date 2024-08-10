import { React, useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./settingsPage.module.css";
import ToggleSwitch from "./toggleSwitch";
import {
    updateNotifications,
    getPreferences,
    getColorTheme,
    colorThemeChange,
} from "../Backend";

function SettingsPage() {
    const location = useLocation();
    const { user, preferences } = location.state;
    console.log(preferences);

    const [notificationPreferences, setNotificationPreferences] =
        useState(preferences);

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [colorChanged, setColorChanged] = useState(false);

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
        getPreferences({ userid: user._id }).then((response) => {
            if (response) {
                setNotificationPreferences({
                    notifications: response.data.notifications,
                    notificationsHigh: response.data.notificationsHigh,
                    notificationsLow: response.data.notificationsLow,
                    reminderDaysBeforeDeadline:
                        response.data.reminderDaysBeforeDeadline,
                    reminderTime: response.data.reminderTime,
                    tutorialPriority: response.data.tutorialPriority,
                    lecturePriority: response.data.lecturePriority,
                    quizPriority: response.data.quizPriority,
                });
            }
        });

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

        setColorChanged(false);
    }, [user._id, themes, colorChanged]);

    const {
        notifications,
        notificationsHigh,
        notificationsLow,
        reminderDaysBeforeDeadline,
        reminderTime,
        tutorialPriority,
        lecturePriority,
        quizPriority,
    } = notificationPreferences;

    const reminderDayOptions = Array.from({ length: 8 }, (_, index) => index);
    const timingsDictionary = Array.from({ length: 24 }).reduce(
        (acc, _, hour) => {
            const isAM = hour < 12 || hour === 24;
            let hourIn12 = hour % 12;
            hourIn12 = hourIn12 === 0 ? 12 : hourIn12; // Convert 0 to 12 for 12 AM and 12 PM
            const suffix = isAM ? "AM" : "PM";
            acc[hour] = `${hourIn12}${suffix}`;
            return acc;
        },
        {}
    );

    const handleInputChange = (name) => (event) => {
        setSuccess(false);
        if (name === "notifications" && !event.target.checked) {
            setNotificationPreferences((prevState) => ({
                ...prevState,
                notifications: !prevState[name],
                notificationsHigh: false,
                notificationsLow: false,
            }));
        } else if (
            name === "notificationsHigh" ||
            name === "notificationsLow"
        ) {
            setNotificationPreferences((prevState) => ({
                ...prevState,
                [name]: !prevState[name],
            }));
        } else {
            setNotificationPreferences((prevState) => ({
                ...prevState,
                [name]: event.target.value,
            }));
        }
    };

    const handleColorThemeChange = async (theme) => {
        colorThemeChange(user._id, theme)
            .then((data) => {
                if (data.error) {
                } else {
                    setColorChanged(true);
                }
            })
            .catch();
    };

    const onSave = async () => {
        try {
            setLoading(true);
            const response = await updateNotifications({
                userid: user._id,
                notifications: notifications === "on" ? true : notifications,
                notificationsHigh:
                    notificationsHigh === "on" ? true : notificationsHigh,
                notificationsLow:
                    notificationsLow === "on" ? true : notificationsLow,
                reminderDaysBeforeDeadline: reminderDaysBeforeDeadline,
                reminderTime: reminderTime,
                tutorialPriority: tutorialPriority,
                lecturePriority: lecturePriority,
                quizPriority: quizPriority,
            });
            if (response) {
                setLoading(false);
                setSuccess(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onReset = async () => {
        setSuccess(false);
        setNotificationPreferences({
            notifications: true,
            notificationsHigh: true,
            notificationsLow: true,
            reminderDaysBeforeDeadline: 1,
            reminderTime: 0,
            tutorialPriority: "Low",
            lecturePriority: "Low",
            quizPriority: "High",
        });
    };

    const navigate = useNavigate();

    const onLandingPage = () => {
        navigate("/landingpage", { state: { user } });
    };

    const onFeedbackPage = () => {
        navigate("/feedbackpage", { state: { user } });
    };

    const successMessage = () => {
        return (
            success && (
                <div
                    className={styles.successMessage}
                    style={{ display: success ? "" : "none", color: "green" }}
                >
                    Settings saved successfully!
                </div>
            )
        );
    };

    const loadingMessage = () => {
        if (loading) {
            return (
                <div id="spinner" className={styles.spinnerGroup}>
                    <div className={styles.spinner}></div>
                    <p>Please wait patiently as we update your settings...</p>
                </div>
            );
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.headerGroup}>
                <h2>Settings</h2>
            </div>
            <div className={styles.settingsContainer}>
                <div className={styles.settingItem}>
                    <label>Allow Push Notifications</label>
                    <ToggleSwitch
                        toggled={notifications}
                        name={"notifications"}
                        handleInputChange={handleInputChange}
                        disabled={false}
                    />
                </div>
                <div className={styles.settingItem}>
                    <label>Turn on notifications for High Priority Tasks</label>
                    <ToggleSwitch
                        toggled={notificationsHigh}
                        name={"notificationsHigh"}
                        handleInputChange={handleInputChange}
                        disabled={!notifications}
                    />
                </div>
                <div className={styles.settingItem}>
                    <label>Turn on notifications for Low Priority Tasks</label>
                    <ToggleSwitch
                        toggled={notificationsLow}
                        name={"notificationsLow"}
                        handleInputChange={handleInputChange}
                        disabled={!notifications}
                    />
                </div>
                <div className={styles.settingItem}>
                    <label>Set a reminder</label>
                    <select
                        value={reminderDaysBeforeDeadline}
                        onChange={handleInputChange(
                            "reminderDaysBeforeDeadline"
                        )}
                    >
                        {reminderDayOptions.map((day) => {
                            return (
                                <option key={day} value={day}>
                                    {day <= 1 ? `${day} day` : `${day} days`}
                                </option>
                            );
                        })}
                    </select>
                    <label>before deadline at</label>
                    <select
                        value={reminderTime}
                        onChange={handleInputChange("reminderTime")}
                    >
                        {Object.entries(timingsDictionary).map(
                            ([hour, time]) => {
                                return (
                                    <option key={hour} value={hour}>
                                        {time}
                                    </option>
                                );
                            }
                        )}
                    </select>
                </div>
                <div className={styles.settingItem}>
                    <label>Set default priority levels: </label>
                    <br />
                    <label>Tutorial</label>
                    <select
                        value={tutorialPriority}
                        onChange={handleInputChange("tutorialPriority")}
                    >
                        <option value="Low">Low</option>
                        <option value="High">High</option>
                    </select>
                    <br />
                    <label>Lecture</label>
                    <select
                        value={lecturePriority}
                        onChange={handleInputChange("lecturePriority")}
                    >
                        <option value="Low">Low</option>
                        <option value="High">High</option>
                    </select>
                    <br />
                    <label>Quiz</label>
                    <select
                        value={quizPriority}
                        onChange={handleInputChange("quizPriority")}
                    >
                        <option value="Low">Low</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className={styles.colorContainer}>
                    <p>CHANGE THEME:</p>
                    <button onClick={() => handleColorThemeChange("default")}>
                        Default Blue
                    </button>
                    <button onClick={() => handleColorThemeChange("light")}>
                        Light
                    </button>
                    <button onClick={() => handleColorThemeChange("dark")}>
                        Dark
                    </button>
                    <button onClick={() => handleColorThemeChange("green")}>
                        Green
                    </button>
                    <button onClick={() => handleColorThemeChange("pink")}>
                        Pink
                    </button>
                </div>
                <div className={styles.buttonGroup}>
                    <button onClick={onSave}>Save</button>
                    <button onClick={onReset}>Reset to Default</button>
                </div>
                {loadingMessage()}
                {successMessage()}
                <div className={styles.linkGroup}>
                    <button onClick={onLandingPage}>
                        Back to Landing Page
                    </button>
                    <button onClick={onFeedbackPage}>
                        Leave us a Feedback!
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
