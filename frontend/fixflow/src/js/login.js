//Login page 
import React from "react";
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { data, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

const LoginPage = () => {

    //storing data
    const [userData, setUserData] = useState({username: "",
                                              password: "",});
    const navigate = useNavigate();

    //storiing error 
    const [signError, setError] = useState(false);
    const [errormsg, seterrormsg] = useState("Please check your details and try again.")

    //checking if the user is already logged in 
    useEffect(() => {
                fetch("http://localhost:5000/user/auth/status", {
                method: "GET",
                credentials: "include"   
                })
                .then(async (res) => {
                    if (res.ok) {
                        // res.ok is 
                        //send it to home page 
                        navigate('/profile');
                    }
                    
                })
                .catch(err => console.error("Error checking login status:", err));
            }, [navigate]);

    //funtion that submits form 
    const  handleSubmit = async () =>{
        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                credentials: "include",
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then(async (res) => {
                  const data = await res.json();
                      if (!res.ok) {
                        // res.ok is false if status is 4xx or 5xx
                        //send it to home page 
                        setError(true)
                        seterrormsg(data.message)
                      } else {
                        navigate('/profile');
                        console.log("Success:", res.status, data.message);
                      }})
                
                .catch(err => {
                });


            const result = await response.json();
            //console.log(result);
            } catch (error) {
            }
    }

    //handling data 
    const handleChange = (e) =>{
        const {name, value} = e.target; 
        setUserData(prev => {const updated = { ...prev, [name]: value }
          //console.log("log : ", updated)
          return updated
        });
    }

    return (
    <div style={styles.container}>
      <Grid textAlign="center" verticalAlign="middle" style={{ height: '100vh' }}>
        <Grid.Column style={{ maxWidth: 450 }}>
          
          <Header as="h2" color="teal" textAlign="center">
            Log-in to your account
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="username"
                type="username"
                name='username'
                value={userData.username}
                onChange={handleChange}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                name='password'
                value={userData.password}
                onChange={handleChange}
              />
              <Button color="teal" fluid size="large" onClick={handleSubmit} >
                Login
              </Button>
            </Segment>
          </Form>
          {signError && (
                              <Message
                              error
                              header="Login Failed"
                              content={errormsg}
                              />
                          )}
          <Message>
            New to us? <a href="#">Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#000',
    height: '100vh',
    padding: '1em',
  },
};

export default LoginPage