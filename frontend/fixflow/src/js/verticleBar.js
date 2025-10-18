//File for the verticla side bar component 
import React from 'react';

import { Link } from 'react-router-dom';


function VerticalBar() {
    return (
        
            <div className="ui vertical menu">
                <Link className="item" to={`/`}>Home</Link>
                <a className="item">Projects</a>
                <a className="item">Contact</a>
            </div>

    );
};





export default VerticalBar ; 














