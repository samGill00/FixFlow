/*This the main app, it has the main function which adds the pages dynamically.
//it is also the first page.
//importing required pages */
import React from 'react';

//routing components 
import {
BrowserRouter as Router,
Route,
Link,
Redirect,
Routes,
} from 'react-router-dom'




import HomePage from "./home"
import ProjectPage from "./projectPage"
import NotFound from './notFound';


/*header file */
import Header from "../html-modules/header";
//css files 
import '../semantic-css/root.css'; 
import '../semantic-css/projectList.css'

/*exporting funtion for index.js*/
class App extends React.Component{
    render() {
        return (
            /*header*/
            <div>
                <Header />
                <div  >  
                    <Routes>
                        <Route path='/' element={<HomePage />}></Route>
                        <Route  path='/projects/:projectID' element={<ProjectPage />}></ Route >
                        {/*route to catch them all*/}
                        <Route path="*" element={<NotFound />} />
                    </Routes>                
                    
                </div>                
            </div>
            
        );
    }
}

export default App;