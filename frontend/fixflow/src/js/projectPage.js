import React from 'react';

//routing comp 
import { Link } from 'react-router-dom'

import VerticalBar from './verticleBar';
//react hooks 
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ProjectPage = () => {
    //hard coded vlaues needs changing 
    const TestProjects = [[0,'Testing','active','3'],[1,'Testing','active','3'],[2,'Testing','active','4']];
    //geting project id from url 
    const {id} = useParams();
    const project = TestProjects.find(
                (a) => a.id === id
                );
    return (
            
        <div className="ui grid">
  
        <div className="three wide column">
            <VerticalBar />
        </div>


        <div className="thirteen wide column">
            <div className="ui segment">
            <h2 className="ui header">{project[1]}</h2>
            <p>this is no projj </p>

            <div className="ui horizontal list">
                <div className="item">
                <div className="ui mini teal label">12 Bugs</div>
                </div>
                <div className="item">
                <div className="ui mini blue label">React</div>
                </div>
                <div className="item">
                <div className="ui mini purple label">UI/UX</div>
                </div>
                <div className="item">
                <div className="ui mini orange label">High Priority</div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )

};

export default ProjectPage;