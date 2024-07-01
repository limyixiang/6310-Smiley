import { React } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./profilePage.module.css";

function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state;

    const onLandingPage = () => {
        navigate("/landingpage", { state: { user } });
    };

    return (
        <div className={styles.mainContainer}>
            <div>
                <h2>Hi, {user.name}</h2>
            </div>
            <div className={styles.linkGroup}>
                <button onClick={onLandingPage}>Back to Landing</button>
            </div>
        </div>
    );
}

export default ProfilePage;
