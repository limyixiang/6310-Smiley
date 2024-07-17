import { React, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./feedbackPage.module.css";
import { submitFeedback } from "../Backend";

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

    const handleChange = (e) => {
        setSuccess(false);
        const { name, value } = e.target;
        setFeedbackDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
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
    const successMessage = () => {
        if (success) {
            return (
                <div>
                    Feedback submitted successfully! Thank you for your
                    feedback!
                </div>
            );
        }
    };

    return (
        <div className={styles.container}>
            <h1>Leave us a feedback!</h1>
            <form onSubmit={onSubmit}>
                {/* Feedback Type Dropdown */}
                <div>
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
                <div>
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
                <div>
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

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default FeedbackPage;
