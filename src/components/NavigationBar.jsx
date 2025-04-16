import React from 'react';

import img from "../Assets/logo.png";

const NavigationBar = () => {
    
  return (
    <nav className="bg-black py-3 pr-3 px-4">
        <div className=" mx-auto flex justify-between items-center">
            <img src={img} alt="logo" className="w-20 h-16" />
            <div className="space-x-4 md:space-x-6">
            <a href="/" className="text-white text-lg"> </a>
                <a href="/home" className="text-white text-lg">Home</a>
                <a href="/travel" className="text-white text-lg">TravelHistory</a>
                <a href="/track-register" className="text-white text-lg">Registration</a>
                <a href="/userTable" className="text-white text-lg">UserManagement</a>
                <a href="/Logout" className="text-white text-lg">LogOut</a>
                
       
            </div>
        </div>
    </nav>
);
};

export default NavigationBar;
