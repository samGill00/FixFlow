#file supplies funtion and endpoints to login and verify user 
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from datetime import datetime, timedelta
import jwt
import bcrypt
import random
from .auth_decorator import token
#Secret key variable 
SECRETKEY = 'my-key'

bp = Blueprint('user', __name__, url_prefix='/user')


#helper functions 

#function that hashes password and  returns the hashed pass
def hashPass(userPass):
    password_bytes = userPass.encode('utf-8')
    # Generate a salt and hash the password
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed_password

#function that checks and compare hashed passwords 
def checkHasedPass(givenPass, storedPass):
    provided_password_bytes = givenPass.encode('utf-8')
    
    return bcrypt.checkpw(provided_password_bytes, storedPass)


#funtion that provides a specific user using username 
def getUser(username):
    user = g.db.execute(
        'SELECT * FROM user WHERE username = ?',(username,)
    ).fetchone()

    return user

def getUserWithId(userId):
    user = g.db.execute(
        'SELECT * FROM user WHERE UserId = ?',(userId,)
    ).fetchone()

    return user


#funtion API endpoint for logging user in 

#loggin user 
@bp.route('/login', methods=['POST','PUT' ,'OPTIONS'])
def login_user():
    if request.method == 'OPTIONS':
        # Preflight request — respond with empty 204
        return '', 204
    
    data = request.get_json()

    user = getUser(data['username'])

    #checking if the user is in the database 
    if not user :
        #user not found 
        response = jsonify({"message": "No user found"})

    if checkHasedPass(data['password'], user.password) :
        #password is right
        #generating token 
        token = jwt.encode(
            {"sub": data['username'], "exp": datetime.now(datetime.timezone.utc) + timedelta(hours=1), 'public_id': user.userId},
            SECRETKEY,
            algorithm="HS256"
        )

        response = jsonify({"message": "logged in"})
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,          # JS cannot read it → safer
            secure=True,            # send only over HTTPS
            samesite="Strict",      
            max_age=3600
        )
    else:
        #password does not match 
        response = jsonify({"message": "Wrong Password"})

    return response


#endpoint for adding new user 
@bp.route('/signup', methods=['POST','PUT'])
def addUser():

    if request.method == 'OPTIONS':
        # Preflight request — respond with empty 204
        return '', 204
    
    data = request.get_json()
    addedUser = False
    #creating a user id 
    num = random.randint(1, 10000)
    userId = f'US{num}'

    #hashing user's password 
    userPass = hashPass(data['password'])

    #checking method 
    if request.method == 'POST' :
        try:
            g.db.execute("""
                INSERT INTO user (userId, name, username, password)
                VALUES (?, ?, ?, ?)
            """, (
                userId,
                data['name'],
                data['username'],
                userPass
            ))
            g.db.commit()  #  update permanent
            addedUser = True
        except:
            print("Error User Already signed up")
            addedUser = False

        
    if addedUser :
        #adding new token for the new user and loggin it in
        #generating token 
        token = jwt.encode(
            {"sub": data['username'], "exp": datetime.now(datetime.timezone.utc) + timedelta(hours=1), 'public_id': userId},
            SECRETKEY,
            algorithm="HS256"
        )

        response = jsonify({"message": "logged in"})
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,          # JS cannot read it
            secure=True,            # send only over HTTPS
            samesite="Strict",      
            max_age=3600
        )
    else:
        #password does not match 
        response = jsonify({"message": "Sign up failed"})

    return response
        
    