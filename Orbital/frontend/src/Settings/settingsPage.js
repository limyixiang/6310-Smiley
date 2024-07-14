import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./settingsPage.module.css";
import ToggleSwitch from "./toggleSwitch";
import { updateNotifications, getPreferences } from "../Backend";

function SettingsPage() {
    const location = useLocation();
    const { user, preferences } = location.state;
    console.log(preferences);

    const [notificationPreferences, setNotificationPreferences] =
        useState(preferences);

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getPreferences({ userid: user._id }).then((response) => {
            // console.log(response);
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
    }, [user._id]);

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

    const successMessage = () => {
        if (success) {
            return <h4>Settings saved successfully!</h4>;
        }
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
                {loadingMessage()}
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
