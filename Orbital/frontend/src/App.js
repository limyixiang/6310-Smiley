import "./App.css";
import Signin from "./Login/signIn.js";
import Signup from "./Login/signUp.js";
import Dashboard from "./Login/dashboard.js";
import ForgetPassword from "./Login/forgetPassword.js";
import ResetPassword from "./Login/resetPassword.js";
import LandingPage from "./Landing/landingPage.js";
import CoursePage from "./Course/coursePage.js";
import ProfilePage from "./Profile/profilePage.js";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

function App() {
    return (
        <div className="App">
            {/* Setting up the Router component from react-router-dom */}
            <Router>
                {/* Defining different Routes using Routes and Route components */}
                <Routes>
                    {/* Route for the Dashboard component */}
                    <Route exact path="/" element={<Dashboard />} />
                    {/* Route for the Login component */}
                    <Route exact path="/signin" element={<Signin />} />
                    {/* Route for the Signup component */}
                    <Route exact path="/signup" element={<Signup />} />
                    {/* Route for the ForgetPassword component */}
                    <Route
                        exact
                        path="/forgetpassword"
                        element={<ForgetPassword />}
                    />
                    {/* Route for the ResetPassword component */}
                    <Route
                        exact
                        path="/resetpassword/:token"
                        element={<ResetPassword />}
                    />
                    {/* Route for the LandingPage component */}
                    <Route
                        exact
                        path="/landingpage"
                        element={<LandingPage />}
                    />
                    {/* Route for the CoursePage component */}
                    <Route exact path="/coursepage" element={<CoursePage />} />
                    {/* Route for the ProfilePage component */}
                    <Route
                        exact
                        path="/profilepage"
                        element={<ProfilePage />}
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
