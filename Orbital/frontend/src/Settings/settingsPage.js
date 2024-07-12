import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./settingsPage.module.css";
import ToggleSwitch from "./toggleSwitch";
import { updateNotifications, getPreferences } from "../Backend";

function SettingsPage() {
    const location = useLocation();
    const { user, preferences } = location.state;
    // console.log(preferences);

    const [notificationPreferences, setNotificationPreferences] =
        useState(preferences);

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getPreferences({ userid: user._id }).then((response) => {
            // console.log(response);
            if (response) {
                setNotificationPreferences({
                    notifications: response.data.notifications,
                    notificationsHigh: response.data.notificationsHigh,
                    notificationsLow: response.data.notificationsLow,
                    reminderBeforeDeadline:
                        response.data.reminderBeforeDeadline,
                    tutorialPriority: response.data.tutorialPriority,
                    lecturePriority: response.data.lecturePriority,
                    quizPriority: response.data.quizPriority,
                });
            }
        });
    }, [user._id]);

    const {
        notifications,
        notificationsHigh,
        notificationsLow,
        reminderBeforeDeadline,
        tutorialPriority,
        lecturePriority,
        quizPriority,
    } = notificationPreferences;

    const handleInputChange = (name) => (event) => {
        // console.log(name);
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

    const onSave = async () => {
        try {
            const response = await updateNotifications({
                userid: user._id,
                notifications: notifications,
                notificationsHigh: notificationsHigh,
                notificationsLow: notificationsLow,
                reminderBeforeDeadline: reminderBeforeDeadline,
                tutorialPriority: tutorialPriority,
                lecturePriority: lecturePriority,
                quizPriority: quizPriority,
            });
            if (response) {
                setSuccess(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onReset = async () => {
        setNotificationPreferences({
            notifications: true,
            notificationsHigh: true,
            notificationsLow: true,
            reminderBeforeDeadline: 1440,
            tutorialPriority: "Low",
            lecturePriority: "Low",
            quizPriority: "High",
        });
    };

    const navigate = useNavigate();

    const onLandingPage = () => {
        navigate("/landingpage", { state: { user } });
    };

    const successMessage = () => {
        if (success) {
            return <h4>Settings saved successfully!</h4>;
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.headerGroup}>
                <h2>Settings Page</h2>
            </div>
            <div>
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
                        value={reminderBeforeDeadline}
                        onChange={handleInputChange("reminderBeforeDeadline")}
                    >
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="180">3 hours</option>
                        <option value="360">6 hours</option>
                        <option value="720">12 hours</option>
                        <option value="1440">1 day</option>
                        <option value="2880">2 days</option>
                        <option value="4320">3 days</option>
                    </select>
                    <label>before deadline</label>
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
                {successMessage()}
                <div className={styles.buttonGroup}>
                    <button onClick={onSave}>Save</button>
                    <button onClick={onReset}>Reset to default</button>
                    <button onClick={onLandingPage}>
                        Back to Landing Page
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
