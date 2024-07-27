import { useState, React, useEffect } from "react";
import {
    isAuthenticated,
    signout,
    updateSubscriptions,
    getUserName,
} from "../Backend";
import { useNavigate } from "react-router-dom";
import styles from "./dashboardPage.module.css";
import logo from "../smileytransparent.jpg";
import { getExistingSubscription, createSubscription } from "../utils/Push";
import "../Profile/colorPicker.module.css";

const Dashboard = () => {
    const navigate = useNavigate(); // Initialize navigation
    const authenticatedUser = isAuthenticated(); // Check if the user is authenticated
    const [isShaking, setShaking] = useState(false); // State for shaking animation
    const [userName, setUserName] = useState("");
    const [quote, setQuote] = useState("Keep smiling and studying :D");
    const [author, setAuthor] = useState("Smiley");
    const [isQuoteDisabled, setIsQuoteDisabled] = useState(false);

    const fetchQuote = async () => {
        try {
            const response = await fetch("https://api.quotable.io/random");
            const data = await response.json();
            setQuote(data.content);
            setAuthor(data.author);
        } catch (error) {
            console.error("Error fetching the quote", error);
        }
    };

    // Prevent spamming API
    const handleFetchQuote = () => {
        fetchQuote();

        setIsQuoteDisabled(true);

        setTimeout(() => {
            setIsQuoteDisabled(false);
        }, 500);
    };

    // Updates username in dashboard on change in profile page
    useEffect(() => {
        if (authenticatedUser) {
            getUserName({ userid: authenticatedUser.user._id }).then((data) => {
                setUserName(data.data);
            });
        }
    }, [authenticatedUser]);

    // Function to handle signout action
    const onSignout = () => {
        signout(); // Perform signout action
        console.log("Signed out");
        navigate("/signin"); // Redirect to login page after sign out
    };

    const onLandingPage = () => {
        if (authenticatedUser) {
            check_and_update_subscription(authenticatedUser.user);
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
                <h1>Hello, {userName}!</h1>
                <h1 className={styles.reflectionWelcomeMessage}>
                    Hello, {userName}!
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
            <div className={styles.quoteGroup}>
                <p>" {quote} "</p>
                <p>- {author}</p>
                <button
                    className={isQuoteDisabled ? styles.disabled : ""}
                    onClick={handleFetchQuote}
                    disabled={isQuoteDisabled}
                >
                    New Quote
                </button>
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
