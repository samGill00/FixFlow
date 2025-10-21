import React from 'react';

//routing comp 
import { Link } from 'react-router-dom'

import VerticalBar from './verticleBar';
import Bugs from './bug-list';

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
            <div style={{ marginTop: '2rem' }}></div>
            <PageHeader />

            <div className="ui section divider"></div>
            <Bugs />
        </div>
        </div>
    )

};

//project header 
const PageHeader = () =>{
    
    return (
        <div >
        <h2 className="ui  header">🚀 Project Alpha</h2>
        <div className="meta">Tracking bugs and performance issues</div>
        
        <div style={{ marginTop: '2rem' }} />
        {/* Bug Count + Tags */}
        <div className="four wide column right aligned">
        <div className="ui horizontal list">
            <div className="item">
            <div className="ui red label">
                <i className="bug icon"></i> 14 Bugs
            </div>
            </div>
            <div className="item">
            <div className="ui blue label">UI</div>
            </div>
            <div className="item">
            <div className="ui purple label">Backend</div>
            </div>
            <div className="item">
            <div className="ui orange label">Performance</div>
            </div>
        </div>
        </div>
        </div>

    )
}



export default ProjectPage;