//File for the verticla side bar component 
import React from 'react';

import { Link, useNavigate } from 'react-router-dom';


function VerticalBar() {
    const navigate = useNavigate();
    //funtion for handling sign out
    const handleSignOut = () =>{
        fetch("http://localhost:5000/user/logout", {
            method: "POST",
            credentials: "include"
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.message);
                navigate("/"); // redirect to login page
            })
            .catch(err => console.error("Logout error:", err));
        };

    return (
        
            <div className="ui vertical menu">
                <Link className="item" to={`/`}>Home</Link>
                <Link className="item" to={`/profile`}>Projects </Link>
                <a className="item">Contact</a>
                <a className='item' onClick={handleSignOut} >Sign out</a>
            </div>

    );
};





export default VerticalBar ; 














