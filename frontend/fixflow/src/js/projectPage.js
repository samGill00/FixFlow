import React, { useState } from 'react';

//routing comp 
import { Link } from 'react-router-dom'

import VerticalBar from './verticleBar';
import Bugs from './bug-list';
import { AddTags } from './projectList';

//importing data 
import projectList from './data/project-data.json';

//react hooks 
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ProjectPage = () => {

    //loading data 
    const [projectData, setProjectData] = useState(projectList)
    //geting project id from url 
    const {projectID} = useParams();
    
    const project = projectData.find(
                (a) => a.ID === projectID
                );

    return (
            
        <div className="ui grid">
  
        <div className="three wide column">
            <VerticalBar />
        </div>


        <div className="thirteen wide column">
            <div style={{ marginTop: '2rem' }}></div>
            <PageHeader
             name={project.Title}
             tags={project.Tags}
             bugs={project.Bugs}
             />

            <div className="ui section divider"></div>
            <Bugs />
        </div>
        </div>
    )

};

//project header 
const PageHeader = (props) =>{
    
    return (
        <div >
        <h2 className="ui  header">{props.name}</h2>
        <div className="meta">Tracking bugs and performance issues</div>
        
        <div style={{ marginTop: '2rem' }} />
        {/* Bug Count + Tags */}
        <div className="four wide column right aligned">
        <div className="ui horizontal list">
            <div className="item">
            <div className="ui red label">
                <i className="bug icon"></i> {props.bugs} Bugs
            </div>
            </div>

            <AddTags projTags={props.tags} />
            </div>
        </div>
        </div>

    )
}




export default ProjectPage;