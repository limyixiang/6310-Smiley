import './App.css';
import { 
  BrowserRouter as Router,
  Routes,
  Route
 } from 'react-router-dom';
import Home from './components/homePage/home';
import Login from './components/loginPage/login';
import SignUp from './components/signUpPage/signUp';
import ForgetPassword from './components/forgetPasswordPage/forgetPassword';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signUp" element={<SignUp />} />
          <Route exact path="/forgetPassword" element={<ForgetPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
