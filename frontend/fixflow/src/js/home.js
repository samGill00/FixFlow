//Landing/home page for the application contains info about the web app and Login/sign up options

import React from "react";
import { Menu, Button, Container, Header, Segment } from "semantic-ui-react";
import "../semantic-css/HomePage.css"; // import CSS for background
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage-background"> 

      <Menu  borderless inverted style={{ background: "rgba(0,0,0,0.4)" }} className="top-bar" >
        <Menu.Menu position="right">
          <Menu.Item>
            <Link className="header" to={`/login`}>
                    <Button primary>Sign In</Button>
            </Link>
            
          </Menu.Item>
          <Menu.Item>
            <Link className="header" to={`/signup`}>
                    <Button secondary>Sign Up</Button>
            </Link>         
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Container text textAlign="center" className="center-content">
        <Segment inverted padded="very" style={{ background: "rgba(0,0,0,0.0)" }}>
          <Header as="h1"  className="ui header"> 
            Fix Flow
          </Header>
          <Header as="h3">
            Track all the bugs in projects and keep building... 
          </Header>
        </Segment>
      </Container>
      <div className="ui grid">
        <div className="eight wide column">
        <div className="ui segment" style={{ textAlign: "left", background: "rgba(0,0,0,0.0)"  }}>
            <p className="ui description">
                Organise your project's development using fix flow to track bugs. It is easy to use, all you need is just create account and off you go hacking 
            </p>
        </div>
      </div>
      <div className="eight wide column">
            <img className="right-img" src="/assets/sample-bug-page.png" alt="Fix Flow preview" />
            
        </div>
      </div>

    </div>
  );
};

export default HomePage;
