/*props  is the  home page, contains the list of new projects, and modify those.
//home page component for storing project list */
import React from 'react';
import { useState } from 'react';

//routing comp 
import { Link, useNavigate } from 'react-router-dom'

//importing semantic react components 
import {Button, Modal, Form, Input, Label, Icon} from 'semantic-ui-react';
import  DatePicker from 'react-semantic-ui-datepickers';

//routing hooks
import { useEffect } from 'react';

//other components 
import VerticalBar from './verticleBar';

//importing data 
import projectData from './data/project-data.json'


function ProjectList() {
    //rendering 
    const navigate = useNavigate();
    //function that converts the strings in tags 
    const stringToList = (inputArray) => {
      //console.log("inside input ", inputArray)
        return inputArray.map((input) => {
          const tagString = typeof input.tags === 'string'
            ? input.tags.split(',').map(str => str.trim())
            : [];
          return { ...input, tags: tagString };
  });

    }
    // setting state variable and  function 
    const [projData, setProjectData] = useState([]);
    //getting/ sedding data 
    useEffect(() => {
            fetch(`http://localhost:5000/data/projectdata`, {
            method: "GET",
            credentials: "include" 
            })
                .then(async (res) => {
                  const data = await res.json();
                      if (!res.ok) {                     
                        // res.ok is false if status is 4xx or 5xx
                        //send it to home page 
                        navigate('/');                        
                      } else {
                        console.log("Success:", res.status, data.message);
                        setProjectData(stringToList(data))
                      }                    
                    })
                .catch(err => console.error(err));
            }, []);
    //
    
    //variable to pass to mold dialog box 
    const [selectedBug, setSelectedBug] = useState(null);
    //variable for controlling the modal dialogbox
    const [open, setOpen] = useState(false);

    //function to handle form submit for both updating and adding new 
    const handleSave = async (updatedBug, type) =>{
      setOpen(false)
      //console.log("inside header ",type)
    try {
      const response = await fetch('http://localhost:5000/data/addproject', {
        method: type,
        credentials: "include" ,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBug)
      })
        .then(async (res) => {
                  const data = await res.json();
                      if (!res.ok) {                     
                        // res.ok is false if status is 4xx or 5xx
                        //send it to home page 
                        navigate('/');                        
                      } else {
                        console.log("Success:", res.status, data.message);
                        // Update local state to trigger re-render
                        setProjectData(stringToList(data));
                      }                    
                    })

      const result = await response.json();
      //console.log(result);
    } catch (error) {
    console.error("Error sending data:", error);
  }
    setSelectedBug(null);

    }
    
    //function for deleting the project data 
    const handleDelete = async (projID) => {
      try {
        const response = await fetch(`http://localhost:5000/data/removeproject?id=${projID}`, {
          method: 'DELETE',
          credentials: "include" 
        })
          .then(async (res) => {
                  const data = await res.json();
                      if (!res.ok) {                     
                        // res.ok is false if status is 4xx or 5xx
                        //send it to home page 
                        navigate('/');                        
                      } else {
                        console.log("Success:", res.status, data.message);
                        // Update local state to trigger re-render
                        setProjectData(stringToList(data));
                      }                    
                    })
        const result = await response.json();
      //console.log(result);
      } 
      catch (error) {
      console.error("Error deleting data:", error);
      }
    }

    //creating a list of projects
    //only when data is present 
    const setProjs = (projData) => {
        if ((Array.isArray(projData) && projData.length > 0)) 
        {return (projData.map((projs) => (
              <ProjectEntry
              key={projs.projectId}
              id={projs.projectId}
              name={projs.title}
              team={projs.team}
              bugs={projs.bug_count}
              tags={projs.tags}
              date={projs.bugDate}
              setIsEditing={() => setSelectedBug(projs)}
              deleteProject = {() => handleDelete(projs.projectId)}
              />
            ))
          )}
        else {
          return false
        }
    }
    
    return (
           <div className="ui grid">
            <div className="four wide column">
                <VerticalBar />
            </div>
            <div className="twelve wide column">
                <h2 className='Projects' style={{ color: '#ff5722' }}>Projects</h2>
                <div className="ui link stackable cards">
                
                {setProjs(projData)}

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
            onSave={(data) => {handleSave(data, 'PUT')}}
            type = {"Edit Project"}
           />
        )}
        {open ?

            //creating a new temporarty and empty bug to pass to react modal
           <ReactModalProject
            bug = {
                    {projectId : '',
                    title: '',
                    team :'',
                    bug_count: '',
                    tags: '',
                    bugDate: ''}
                  } // giving an empty title with no default values  
            onClose={() => setOpen(false)}
            onSave={(data) => {handleSave(data, 'POST')}}
            type = {"New Project"} 
           />
        : <></> }
            </div>     
            );
}

// element for each indiviual projecct entry 
//It also act as a link to open project into new page
function ProjectEntry(props) {
  //handeling delete click 
  const handleDeleteButton = () =>{
    //calling the parent delete method
    
  }
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

                <div className="extra content" style={{ display: 'flex', gap: '0.5em' }}>
              <button className="ui mini button" onClick={props.setIsEditing}  >Edit</button>
              <button className="ui mini red icon button" onClick={props.deleteProject}  >
                <i className="trash alternate outline icon"></i>
                </button>
            </div>
            </div>
            
            </div>
        </div> 

   )
}

//const funtion  to add tags to the projects
export const AddTags = ({projTags}) =>{
    const tags = projTags.map((tag, index) =>(
        <div className="item" key={index}>
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
  //varible too track tags 
  const [tagInput, setTagInput] = useState('');
    //re-rendring when new value is added 
    useEffect(() => {
        setFormData(bug); // reset when bug changes
    }, [bug]);

    const handleChange = (e) => {
        const {name, value} = e.target; 
        setFormData(prev => {const updated = { ...prev, [name]: value }
          //console.log("log : ", updated)
          return updated
        });

    };
    //function for adding a new tag 
    const handleAddTag = () => {
      const trimmed = tagInput.trim();
      if (trimmed && !formData.tags.includes(trimmed)) {
        setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmed] 
      }));
        setTagInput('');
      }
    };
    //function for removing a tag 
    const handleRemoveTag = (tagToRemove) => {
      setFormData(prev => ({
        ...prev,
        tags : prev.tags.filter(tag => tag !== tagToRemove)
    }));
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      }
    };
    //funtion for handle data change 
    const handleDateChange = (event, data) => {
      if (!data.value) return;
      const dateOnly = data.value.toISOString().split('T')[0]; 
      setFormData(prev => ({
        ...prev,
        bugDate: dateOnly
      }));
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
              <input name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="ui dropdown">
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="ui dropdown">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="field">
              <label>Assigned To</label>
              <input name="team" value={formData.team} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Add Tags</label>
              <Input
                placeholder='Enter a tag...'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                action={
                  <Button color='blue' type="button"  onClick={handleAddTag}>
                    Add
                  </Button>
                }
              />
            </div>
            {formData?.tags?.length > 0  > 0 && (
              <div className="field">
                <label>Tags:</label>
                <div>
                  {formData.tags.map((tag, index) => (
                    <Label key={index} color='teal' style={{ marginBottom: '5px' }}>
                      {tag}
                      <Icon name='delete' onClick={() => handleRemoveTag(tag)} />
                    </Label>
                  ))}
                </div>
              </div>
            )}

            <div className="field">
              <label>Date</label>
              <DatePicker
                value={formData.bugDate ? new Date(formData.bugDate) : null}
                onChange={handleDateChange}
                placeholder="Select a date"
                clearable
                format="DD/MM/YYYY"
                locale="en-GB"
              />

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