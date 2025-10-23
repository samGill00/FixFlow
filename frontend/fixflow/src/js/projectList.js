/*props  is the  home page, contains the list of new projects, and modify those.
//home page component for storing project list */
import React from 'react';
import { useState } from 'react';

//routing comp 
import { Link } from 'react-router-dom'

//importing semantic react components 
import {Button, Modal, Form} from 'semantic-ui-react';

//routing hooks
import { useEffect } from 'react';

//other components 
import VerticalBar from './verticleBar';

//importing data 
import projectData from './data/project-data.json'


function ProjectList() {
    //rendering 

    // 
    const [projData, setProjectData] = useState(projectData);

    //
    //variable to pass to mold dialog box 
    const [selectedBug, setSelectedBug] = useState(null);
    //variable for controlling the modal dialogbox
    const [open, setOpen] = useState(false);
    //creating a list of projects
    const Projects = projData.map((projs) => (
        <ProjectEntry
        key={projs.ID}
        id={projs.ID}
        name={projs.Title}
        team={projs.Team}
        bugs={projs.Bugs}
        tags={projs.Tags}
        date={projs.Date}
        setIsEditing={() => setSelectedBug(projs)}
        />
    ));
    return (
           <div className="ui grid">
            <div className="four wide column">
                <VerticalBar />
            </div>
            <div className="twelve wide column">
                <h2 className='Projects' style={{ color: '#ff5722' }}>Projects</h2>
                <div className="ui link stackable cards">
                
                {Projects}

                <div className="card">
            <div className="center aligned content">
            <AddNewProject
                setOpen={setOpen} />        
            </div>
            </div>
                </div>
               </div>
            {selectedBug  && (
        
        <ReactModalProject
            bug = {selectedBug}     
            onClose={() => setSelectedBug(null)}
            onSave={(updatedBug) => {
            // handle save logic here
            console.log('Updated bug:', updatedBug);
            setSelectedBug(null);
          }}
          type = {"Edit Project"}
           />
        )}
        {open ?

            //creating a new temporarty and empty bug to pass to react modal
            
           <ReactModalProject
            bug = {{"Title" :  ""}}   // giving an empty title with no default values  
            onClose={() => setOpen(false)}
            onSave={(updatedBug) => {
            // handle save logic here
            console.log('Updated bug:', updatedBug);
            setOpen(false);
            }}
            type = {"New Project"} 
           />
        : <></> }
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
             <div className="meta">{props.date}</div>
            <div className="description">
                <p><strong>Team:</strong>{props.team}</p>
                <p><strong>Bugs:</strong>{props.bugs}</p>
                <div className="ui horizontal list">
                
                <AddTags 
                    projTags = {props.tags}
                />
                </div>

                <div className="extra content">
              <button className="ui mini button" onClick={props.setIsEditing}  >Edit</button>
            </div>
            </div>
            
            </div>
        </div> 

   )
}

//const funtion  to add tags to the projects
export const AddTags = ({projTags}) =>{
    const tags = projTags.map((tag) =>(
        <div className="item">
                <div className="ui mini orange label">{tag}</div>
                </div>
    ));
    return (
            tags
    )
}
//routing to next page button to view projects in large
function projectButton() {
    
}

//new / edit project form
//form and modal uisng semantic react componets 
function ReactModalProject({ bug, onSave, onClose, type }) {
  const [formData, setFormData] = useState(bug);
    //re-rendring when new value is added 
    useEffect(() => {
        setFormData(bug); // reset when bug changes
    }, [bug]);

    const handleChange = (e) => {
        const {name, value} = e.target; 
        //console.log("log : ", { ...bug, [name]: value })
        setFormData(bug => ({ ...bug, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };



  return (
    <>
      <Modal
        open={true}
        onClose={onClose}
        size="small"
        dimmer="blurring"
      >
        <Modal.Header>{type}</Modal.Header>
        <Modal.Content>
          <form className="ui form" >
            <div className="field">
              <label>Title</label>
              <input name="Title" value={formData.Title} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Status</label>
              <select name="Status" value={formData.Status} onChange={handleChange} className="ui dropdown">
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select name="Priority" value={formData.Priority} onChange={handleChange} className="ui dropdown">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="field">
              <label>Assigned To</label>
              <input name="Assigned" value={formData.Assigned} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Date</label>
              <input name="Date" value={formData.Date} onChange={handleChange} />
            </div>
          </form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>Cancel</Button>
          <Button primary onClick={handleSubmit}>Save</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

//component to add new bugs 
const AddNewProject = (projData) =>{

    return (
            <div >
            <button className="ui icon primary button" title="Add new bug">
                <i className="plus icon" onClick={() => {projData.setOpen(true)
                }}></i>
            </button>
            <div className="description" style={{ marginTop: '0.5rem' }}>
                <strong>Add New Project</strong>
            </div>
            </div>

    )
};

export default ProjectList;