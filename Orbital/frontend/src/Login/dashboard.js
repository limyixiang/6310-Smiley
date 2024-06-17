import { useState, React } from "react";
import { isAuthenticated, signout } from "../Backend";
import { useNavigate } from "react-router-dom";
import styles from "./dashboardPage.module.css";
import logo from "./smileytransparent.jpg";

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
