/*This page shows all the recorded bugs of the projects*/
import React, {useState, useEffect} from "react"; 
import { useNavigate } from 'react-router-dom';

//importing semantic react components 
import {Button, Modal, Form, Input, Label, Icon} from 'semantic-ui-react';
import  DatePicker from 'react-semantic-ui-datepickers';

import { useParams } from "react-router-dom";
//data locally imported 
import bugList from './/data/bug-data.json';



//bugs represents in the project page 
function Bugs() {
    const navigate = useNavigate()
    //variables and function to determine when editing is on 
    const [isEditing, setIsEditing] = useState(false);

    //getting the  id from url 
    const {projectID} = useParams() 

    //state variables, one function for changing state 
    const [bugData, editBugData] = useState([]);

    //getting/ sedding data 
    useEffect(() => {
            fetch(`http://localhost:5000/data/bugdata?projectid=${projectID}`,{
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
                        editBugData(data)
                      }                    
                    })
        .catch(err => console.error(err));
            }, []);

    //variable when new bug is created 
    const [isNewBug, setNewBug] = useState(false);

    //variable for controlling the modal dialogbox
    const [open, setOpen] = useState(false);

    //variable to pass to mold dialog box 
    const [selectedBug, setSelectedBug] = useState(null);

    //event when pressed the edit button 
    const handleChange = (e) =>{
        const {name, value } = e.target ;
            editBugData({ ... bugData , [name]: value});
            //console.log(e)
    }
     //function to handle form submit for both updating and adding new 
    const handleSave = async (updatedBug, type) =>{
      setOpen(false)
      //console.log("inside header ",type)
    try {
      const response = await fetch('http://localhost:5000/data/addbug', {
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
                        editBugData(data)
                      }                    
                    })

      const result = await response.json();
      //console.log(result);
    } catch (error) {
    console.error("Error sending data:", error);
  }
    setSelectedBug(null);
    setIsEditing(false);
    }
  

    //function for deleting the project data 
    const handleDelete = async (projID, bugID) => {
      try {
        const response = await fetch(`http://localhost:5000/data/removebug?projectid=${projID}&bugid=${bugID}`, {
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
                        editBugData(data)
                      }                    
                    })

        const result = await response.json();
      //console.log(result);
      } 
      catch (error) {
      console.error("Error deleting data:", error);
      }
    }


    //handle edtiting button 
    const handleEditButton = (e) =>{
        setSelectedBug();
    }
    // funtion that saves data from the edited form 
    // const handleSave = () =>{
    //     //backend ....
        
    // }
    
    return (
        <div className="ui container">
        <h3 className="ui header">Bugs</h3>
        

    <div className="ui link stackable cards">
        {/*mapping the bugs from the list */}
        {bugData.map((bug, index) => (
        <div key={index} className="ui card" >
            <div className="content">
                <DisplayBug
                    key={bug.bugId}
                    title={bug.title}
                    status={bug.status}
                    date={bug.date}
                    priority={bug.priority}
                    assigned={bug.assigned}
                    setIsEditing={() => setSelectedBug(bug)}
                    deleteProject = {() => handleDelete(bug.projectId,bug.bugId)}
                    /> 
           </div>
           </div>

        ))}     
        
        <div className="card">
        <div className="center aligned content">
        <AddBug
             setNewBug={setNewBug}
             setOpen={setOpen} />        
        </div>
        </div>
        
        {selectedBug  && (
        
        <ReactModal
            bug = {selectedBug}     
            onClose={() => setSelectedBug(null)}
            onSave={(data) => { handleSave(data, 'PUT'); }}
          type = {"Edit Bug"}
           />
        )}
        {open ?

            //creating a new temporarty and empty bug to pass to react modal           
           <ReactModal
            bug = {
                    {bugId : '',
                    title: '',
                    status :'',
                    priority: '',
                    assigned: '',
                    date: '',
                  projectId: projectID}
                  }  // giving an empty title with no default values  
            onClose={() => setOpen(false)}
            onSave={(data) => { handleSave(data, 'POST')}}
            type = {"New Bug"} 
           />
        : <></> }
    </div>
    </div>
    )
}

//normal dispplay of the bug 
const DisplayBug = (bug) =>{
    return (
        <div>
            <div className="header">{bug.title}</div>
            <div className="meta">{bug.date}</div>
            <div className="description">
            <p><strong>Status:</strong>{bug.status}</p>
            <p><strong>Priority:</strong>{bug.priority}</p>
            <p><strong>Assigned to:</strong>{bug.assigned}</p>
           
            <div className="extra content" style={{ display: 'flex', gap: '0.5em' }}>
              <button className="ui mini button" onClick={bug.setIsEditing}  >Edit</button>
              <button className="ui mini red icon button" onClick={bug.deleteProject}  >
                <i className="trash alternate outline icon"></i>
                </button>
            </div>

            </div>
        </div>
    )
}

//edit form for the bug
const EditBug = (bugData) => {
    return (

        <form className="ui form" >
            <div className="field">
              <label>Title</label>
              <input name="title" value={bugData.title} onChange={bugData.handleChange} />
            </div>
            <div className="field">
              <label>Status</label>
              <select name="status" value={bugData.status} onChange={bugData.handleChange} className="ui dropdown">
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select name="priority" value={bugData.priority} onChange={bugData.handleChange} className="ui dropdown">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="field">
              <label>Assigned To</label>
              <input name="assigned" value={bugData.assigned} onChange={bugData.handleChange} />
            </div>
            <div className="field">
              <label>Date</label>
              <input name="date" value={bugData.date} onChange={bugData.handleChange} />
            </div>
            <button className="ui mini primary button" type="button" onClick={bugData.handleSave}>Save</button>
            <button className="ui mini button" type="button" onClick={() => {bugData.setIsEditing(false)
                bugData.se
            }}>Cancel</button>
          </form>
    )

};

//component to add new bugs 
const AddBug = (bugData) =>{

    return (
            <div >
            <button className="ui icon primary button" title="Add new bug">
                <i className="plus icon" onClick={() => {bugData.setOpen(true)
                }}></i>
            </button>
            <div className="description" style={{ marginTop: '0.5rem' }}>
                <strong>Add New Bug</strong>
            </div>
            </div>
    )
};

const NewAddBug = (bugData) =>{

    return (
        <form className="ui form" >
            <div className="field">
              <label>Title</label>
              <input name="title"  onChange={bugData.handleChange} />
            </div>
            <div className="field">
              <label>Status</label>
              <select name="status"  onChange={bugData.handleChange} className="ui dropdown">
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <div className="field">
              <label>Priority</label>
              <select name="priority"  onChange={bugData.handleChange} className="ui dropdown">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="field">
              <label>Assigned To</label>
              <input name="assigned"  onChange={bugData.handleChange} />
            </div>
            <div className="field">
              <label>Date</label>
              <input name="date"  onChange={bugData.handleChange} />
            </div>
            <button className="ui mini primary button" type="button" onClick={bugData.handleSave}>Save</button>
            <button className="ui mini button" type="button" onClick={() => bugData.setIsEditing(false)}>Cancel</button>
          </form>
    )

};

//form and modal uisng semantic react componets 
function ReactModal({ bug, onSave, onClose, type }) {
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
      console.log("form ", formData)
        onSave(formData);
    };

    //funtion for handle data change 
    const handleDateChange = (event, data) => {
      if (!data.value) return;
      const dateOnly = data.value.toISOString().split('T')[0]; 
      setFormData(prev => ({
        ...prev,
        date: dateOnly
      }));
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
              <input name="assigned" value={formData.assigned} onChange={handleChange} />
            </div>
            
            <div className="field">
              <label>Date</label>
              <DatePicker
                value={formData.date ? new Date(formData.date) : null}
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

export default Bugs;