import { useState, React } from "react";
import {
    isAuthenticated,
    signout,
    updateSubscriptions,
    getColorTheme,
} from "../Backend";
import { useNavigate } from "react-router-dom";
import styles from "./dashboardPage.module.css";
import logo from "./smileytransparent.jpg";
import { getExistingSubscription, createSubscription } from "../utils/Push";
import "../Profile/colorPicker.module.css";

const Dashboard = () => {
    const navigate = useNavigate(); // Initialize navigation
    const authenticatedUser = isAuthenticated(); // Check if the user is authenticated
    const [isShaking, setShaking] = useState(false); // State for shaking animation

    // Function to handle signout action
    const onSignout = () => {
        signout(); // Perform signout action
        console.log("Signed out");
        navigate("/signin"); // Redirect to login page after sign out
    };

    const onLandingPage = () => {
        if (authenticatedUser) {
            check_and_update_subscription(authenticatedUser.user);
            changeTheme(authenticatedUser.user);
        }
        navigate("/landingpage", { state: { user: authenticatedUser.user } });
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

    const check_and_update_subscription = (user) =>
        getExistingSubscription().then(async (subscription) => {
            if (subscription) {
                const subscriptionJson = subscription.toJSON();
                // console.log("Auth key:", subscriptionJson.keys.auth);
                // console.log("p256dh key:", subscriptionJson.keys.p256dh);
                // console.log(subscriptionJson.keys);
                // Optionally, send the subscription to your backend for storage or updates
                updateSubscriptions(user._id, subscriptionJson);
            } else {
                console.log("No existing subscription found.");
                // Here you might want to call a function to create a new subscription
                console.log("Creating new subscription");
                const newSubscription = await createSubscription(user);
                const subscriptionJson = newSubscription.toJSON();
                // console.log(subscriptionJson.keys);
                updateSubscriptions(user._id, subscriptionJson);
            }
        });

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
    const changeTheme = (user) => {
        getColorTheme(user._id)
            .then((themeName) => {
                const selectedTheme = themes[themeName];
                for (const key in selectedTheme) {
                    document.documentElement.style.setProperty(
                        key,
                        selectedTheme[key]
                    );
                }
                console.log(selectedTheme);
            })
            .catch((error) => {
                console.error("Error fetching theme:", error);
            });
    };

    return !authenticatedUser ? (
        <div className={styles.mainContainer1}>
            <div className={styles.rippleContainer} onClick={handleClick}>
                <div className={styles.ripple}></div>
            </div>
            <div className={styles.welcomeMessage}>
                <h1>Welcome to Smiley!</h1>
                <h1 className={styles.reflectionWelcomeMessage}>
                    Welcome to Smiley!
                </h1>
            </div>
            <div className={styles.linkGroup1}>
                <a href="/signin">LOGIN</a>
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
    ) : (
        <div className={styles.mainContainer2}>
            {/* {check_and_update_subscription(authenticatedUser.user)} */}
            <div className={styles.rippleContainer} onClick={handleClick}>
                <div className={styles.ripple}></div>
            </div>
            <div className={styles.welcomeMessage}>
                <h1>Hello, {authenticatedUser.user.name}!</h1>
                <h1 className={styles.reflectionWelcomeMessage}>
                    Hello, {authenticatedUser.user.name}!
                </h1>
            </div>
            <div className={styles.linkGroup2}>
                <button onClick={onLandingPage}>LANDING</button>
                <button onClick={onSignout}>SIGN OUT</button>
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
};

export default Dashboard;
