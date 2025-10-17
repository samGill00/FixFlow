/*props  is the  home page, contains the list of new projects, and modify those.
//home page component for storing project list */
import React from 'react';


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
        />
    ));
    return (
           <div >
               <h2 className='Projects'>Project List</h2>
               {Projects}
            </div>     
            );
}

// element for each indiviual projecct entry 
//It also act as a link to open project into new page
function ProjectEntry(props) {
    //if its a header 
    //cosnt for 
    if (props.id  === 0){
        return (
            <div className='project-grid-dark'>
                <div>ID</div>
                <div>Name</div>
                <div>Status</div>
                <div>Active Bugs</div>
            </div>
        )
    }
    else {
        return (
            <div className= {props.id % 2 == 0? 'project-grid-dark': 'project-grid-light'}> 
                <div>{props.id}</div>
                <div>{props.name}</div>
                <div>{props.status}</div>
                <div>{props.bugs}</div>
            </div>
        )
    }
}

//routing to next page button to view projects in large
function projectButton() {
    
}

export default ProjectList;