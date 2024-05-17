import './App.css';
import Signin from './Login/Signin.js'
import Signup from './Login/Signup.js';
import Dashboard from './Login/Dashboard.js';
import ForgetPassword from './Login/forgetPassword.js';
import ResetPassword from './Login/resetPassword.js';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      {/* Setting up the Router component from react-router-dom */}
      <Router>
        {/* Defining different Routes using Routes and Route components */}
        <Routes>
          {/* Route for the Dashboard component */}
          <Route exact path='/' element={<Dashboard/>} />          
          {/* Route for the Login component */}
          <Route exact path="/signin" element={<Signin/>} />
          {/* Route for the Signup component */}
          <Route exact path='/signup' element={<Signup/>} />
          {/* Route for the ForgetPassword component */}
          <Route exact path='/forgetpassword' element={<ForgetPassword/>} />
          {/* Route for the ResetPassword component */}
          <Route exact path='/resetpassword' element={<ResetPassword/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
