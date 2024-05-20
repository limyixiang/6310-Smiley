import React, {useState} from "react";
import { signup } from "../Backend";
import "./signUp.css"

// Signup component for the signup form
function Signup() {

    const [formValues, setFormValues] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword:"",
        error: "",
        loading: false,
        success: false,
    });

    // Destructuring values from the state
    const { name, email, password, confirmPassword, error, loading, success } = formValues;

    // Handles changes in the input fields
    const handleChange = name => event => {
        setFormValues({ ...formValues, error: false, [name]: event.target.value });
    }

    // Submits the form data to the backend
    const onSubmit = async event => {
        event.preventDefault();

        // Passwords do not match
        if (password !== confirmPassword) {
            setFormValues({ ...formValues, error: "Passwords do not match", success: false, loading: false });
            return;
        }

        setFormValues({ ...formValues, success: false, loading: true });

        // Placeholder for the signup function calling the backend
        signup({ name, email, password })
            .then(data => {
                if (data.error) {
                    setFormValues({ ...formValues, error: data.error, loading: false, success: false });
                } else {
                    setFormValues({ ...formValues, success: true });
                }
            })
            .catch();
    }

    // Displays error message if there's any
    const errorMessage = () => {
        return (
            <div className='error-message' style={{ display: error ? "" : "none", color: "red" }}>
                {error}
            </div>
        );
    }

    // Displays loading message during form submission
    const loadingMessage = () => {
        return (
            loading && (
                <div className="loading-message" style={{ display: loading ? "" : "none", color: "black" }}>
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            )
        );
    }

    // Displays success message upon successful form submission
    const successMessage = () => {
        return (
            success && (
                <div className="success-message" style={{ display: success ? "" : "none", color: "black"}}>
                    <center><p className='login_redirect mt-2'>Account created successfully, login <b><a href='/signin'>here</a></b>.</p></center>
                </div>
            )
        );
    }
   
    return (
        <div className='form-container'>
            <div className='form-box'>
                <h2>Create an account</h2>
                {successMessage()}
                <div className='form-group'>
                    <label htmlFor="name">Username</label>
                    <input type="text" id="name" name="name" onChange={handleChange("name")} placeholder="Name" required />
                </div>
                <div className='form-group'>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" name="email" onChange={handleChange("email")} placeholder="Email" required />
                </div>
                <div className='form-group'>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" onChange={handleChange("password")} placeholder="Password" required />
                </div>
                <div className='form-group'>
                    <label htmlFor="confirmPassword">Re-enter your password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" onChange={handleChange("confirmPassword")} placeholder="Re-enter password" required />
                </div>
                <p className="password-requirements">Password should contain at least 8 characters, with at least 1 uppercase, 1 lowercase and 1 number.</p>
                {errorMessage()}
                {loadingMessage()}
                <div className="form-button">
                    <button onClick={onSubmit}>Sign Up</button>
                </div>
                <div className='link'>
                        <center><p className='signup-to-login'><b><a href='/signin'> Back to Login</a></b></p></center>
                </div>
            </div>
        </div>
    );
}

export default Signup;