//file for sign up page 
import React from "react";
import { Button, Form, Grid, Header, Message, Segment, Image } from 'semantic-ui-react';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

const SignUpUser = () => {
    //storing data
    const [userData, setUserData] = useState({ firstname: "",
                                                lastname: "",
                                                username: "",
                                                password: "",
                                                confirmpassword: ""
                                                });

    //storiing error 
    const [signError, setError] = useState(false);
    const [errormsg, seterrormsg] = useState("Please check your details and try again.")

    const navigate = useNavigate();

    //funtion that submits form 
    const  handleSubmit = async () =>{
        try {
            const response = await fetch('http://localhost:5000/user/signup', {
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
                        setError(true);
                        seterrormsg(data.message)
                        console.log("reply ", data.error)
                      } else {
                        navigate('/profile');
                        console.log("Success:", res.status, data.message);
                      }})
                
                .catch(err => {
                    console.error(err);
                });

            //console.log(result);
            } catch (error) {
            console.error("Error sending data:", error);
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
        <Grid>
            <Grid.Column width={10}>
            <Segment basic style={{ height: "100%" }} >
                <Image
                src="/assets/signup-img.jpg"
                alt="Signup Page"
                fluid
                style={{ height: "100%", objectFit: "cover" }}
            />
            </Segment>
            </Grid.Column>

            <Grid.Column width={5}>
            <Segment padded="very" >
                {signError && (
                    <Message
                    error
                    header="Signup Failed"
                    content={errormsg}
                    />
                )}
                <Form >
                <Form.Input
                label="First Name"
                placeholder="Enter your first name"
                name='firstname'
                value={userData.firstname}
                onChange={handleChange}
                />
                <Form.Input
                label="Last Name"
                placeholder="Enter your last name"
                name='lastname'
                value={userData.lastname}
                onChange={handleChange}
                />
                <Form.Input
                label="Username"
                placeholder="Choose a username"
                name='username'
                value={userData.username}
                onChange={handleChange}
                />
                <Form.Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                name='password'
                value={userData.password}
                onChange={handleChange}
                />
                <Form.Input
                label="Confirm Password"
                type="password"
                placeholder="Enter your password"
                name='confirmpassword'
                value={userData.confirmpassword}
                onChange={handleChange}
                />
                {signError && (
                    <Message
                    error
                    header="Signup Failed"
                    content="Please check your details and try again."
                    />
                )}

                <Button primary fluid onClick={handleSubmit}>
                Sign Up
                </Button>
                </Form>
            </Segment>
            </Grid.Column>
        </Grid>
    
    )

};

export default SignUpUser;