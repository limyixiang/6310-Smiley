import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import { signup } from "../../backend";

const SignUp = () => {
    // state = {  } 
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        success: false
    });

    const{ email, password, error, loading, success } = inputValue;

    const handleOnChange = name => event => {
        setInputValue({
            ...inputValue,
            [name]: event.target.value
        });
    }

    const handleError = (err) => 
        toast.error(err, {
            position: "bottom-left",
        });

    const handleSuccess = (msg) => 
        toast.success(msg, {
            position: "bottom-right", 
        })

    // const handleSubmit = async (e) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            // const { data } = await axios.post(
            //     "/signUp",
            //     {
            //         ...inputValue,
            //     },
            //     {withCredentials: true}
            // );
            // const { success, message } = data;
            // if (success) {
            //     handleSuccess(message);
            //     setTimeout(() => {
            //         navigate("/");
            //     }, 1000);
            // } else {
            //     handleError(message);
            // }
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            console.log(error);
        }
        setInputValue({
            ...inputValue,
            email: "",
            password: ""
        });
        console.log('Submitted', inputValue);
    };

    return (
        <div className="container">
            <h1>Sign Up For An Account</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email" 
                        type="email" 
                        name="email" 
                        value={email} 
                        className="form-control" 
                        placeholder="Enter Your Email"
                        onChange={handleOnChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password" 
                        type="password" 
                        className="form-control" 
                        name="password"
                        value={password}
                        placeholder="Enter Your Password"
                        onChange={handleOnChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <ToastContainer />
        </div>
    );
};
 
export default SignUp;