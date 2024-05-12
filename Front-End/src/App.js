import Home from "./pages/home/Home";
import ProfilePage from "./pages/Profile/ProfilePage";
import Signup from "./pages/SignUp/Signup";
import Login from "./pages/Login/Login";
import LandingPage from "./pages/LandingPage/Landing";
import AdminDashboard from "./components/Userprofile/Userprofile";
import PostDetails from "./components/PostDetails/PostDetails";
import React, { useEffect} from 'react';
import { useNavigate } from "react-router";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  
  return (
    <Router>
      <Routes>
       <Route path="/" element={<LandingPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/Home/AdminDashboard" element={< AdminDashboard/>} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/post/:id" element={<PostDetails/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
