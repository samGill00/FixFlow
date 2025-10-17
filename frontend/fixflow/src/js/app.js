/*This the main app, it has the main function which adds the pages dynamically.
//it is also the first page.
//importing required pages */
import React from 'react';
import HomePage from "./home"
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
                <div >                   
                    <HomePage />
                </div>                
            </div>
            
        );
    }
}

export default App;