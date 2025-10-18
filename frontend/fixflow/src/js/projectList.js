/*props  is the  home page, contains the list of new projects, and modify those.
//home page component for storing project list */
import React from 'react';

//routing comp 
import { Link } from 'react-router-dom'

//other components 
import VerticalBar from './verticleBar';

function ProjectList() {
    //rendering 
    //this is statis //needs to be dynamic with flask 
    const TestProjects = [[0,'Testing','active','3'],[1,'Testing','active','3'],[2,'Testing','active','4']]
    //creating a list of projects
    const Projects = TestProjects.map((projs) => (
        <ProjectEntry
        id={projs[0]}
        name={projs[1]}
        status={projs[2]}
        bugs={projs[3]}
        key={projs[0]}
        />
    ));
    return (
           <div class="ui grid">
            <div class="four wide column">
                <VerticalBar />
            </div>
            <div className="twelve wide column">
                <h2 className='Projects' style={{ color: '#ff5722' }}>Projects</h2>
                <div className="ui link stackable cards">
                
                {Projects}
                </div>
               </div>
            </div>     
            );
}

// element for each indiviual projecct entry 
//It also act as a link to open project into new page
function ProjectEntry(props) {
    //if its a header 
    //cosnt for 
   return (     
        <div className="card">
            <div className="content">
            <Link className="header" to={`/projects/${props.id}`} key={props.id}>
                {props.name}
             </Link>
            <div className="description">
                {props.status}
                {/* I need to add some css to  add other things nicely */} 
            </div>
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
        
    
    

   )
}

//routing to next page button to view projects in large
function projectButton() {
    
}

export default ProjectList;