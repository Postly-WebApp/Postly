import React from 'react';
import"./landing.css"
import MyImage from '../LandingPage/5.png';
import mayimage2 from '../LandingPage/image2.jpeg'
import { useNavigate } from "react-router-dom";
export default function LandingPage(){
  const navigate=useNavigate();
  const goTologin = () => {
    navigate("/Login");
  };
  const goTosignup = () => {
    navigate("/Signup");
  };
  return (
    <div className="landing">
      <div className="left-column">
        <div className="logo">
          <img src={MyImage} alt="Logo" />
        </div>
        <div className="image2">
          <img src={mayimage2} alt="Image2" />
        </div>
      </div>
      <div className="right-column">
        <div className="intro-text">
          <div className="marginto">
            <h1 className='text'>POSTLY</h1>
            <p className='mydescription'>Join Postly to be part of a dynamic community where your voice matters.</p>
          </div>
          <button type='submit' className='signbutton' onClick={goTosignup}>Sign Up</button>
          <button type='submit' className='signbutton' onClick={goTologin}>Login</button>
        </div>
      </div>
    </div>
  );
       
      
};


