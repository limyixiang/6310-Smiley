import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    // state = {  } 
    return (
        <div className="container">
            <h1>Login</h1>
            {/* <form onSubmit={handleSubmit}> */}
            <form>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email" 
                        type="email" 
                        className="form-control" 
                        name="email"
                        // value={email}
                        placeHolder="Enter Your Email"
                        // onChange={handleOnChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password" 
                        type="text" 
                        className="form-control" 
                        name="password"
                        // value={password}
                        placeHolder="Enter Your Password"
                        // onChange={handleOnChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <div>
                    <Link to="/signUp">
                        Sign Up
                    </Link>

                    <Link to="/forgetPassword">
                        Forget Password
                    </Link>
                </div>
            </form>
        </div>
    );
}
 
export default Login;