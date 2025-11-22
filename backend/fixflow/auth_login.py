#file supplies funtion and endpoints to login and verify user 
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from datetime import datetime, timedelta, timezone
import jwt
import bcrypt
import random
from .auth_decorator import already_auth
from .helper_functions import getUserWithId, getUser, checkHasedPass, hashPass

#Secret key variable 
SECRETKEY = 'my-key'
#cookie name 
COOKIE_NAME = "access_token"	

bp = Blueprint('user', __name__, url_prefix='/user')



#funtion API endpoint for logging user in 

#loggin user 
@bp.route('/login', methods=['POST','PUT' ,'OPTIONS'])
@already_auth
def login_user():
    if request.method == 'OPTIONS':
        # Preflight request — respond with empty 204
        return '', 204
    #checking if its already auth
    if request.alreadyAuth :
        print("log is already ", request.alreadyAuth)
        response = jsonify({"message": "logged in"})
        return response

    data = request.get_json()

    user = getUser(data['username'])

    #checking if the user is in the database 
    if not user :
        #user not found 
        response = jsonify({"message": "No user found"})

    if checkHasedPass(data['password'], user['password']) :
        #password is right
        #generating token 
        token = jwt.encode(
            {"sub": data['username'], "exp": datetime.now(timezone.utc) + timedelta(hours=1), 'public_id': user['userId']},
            SECRETKEY,
            algorithm="HS256"
        )

        response = jsonify({"message": "logged in"})
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,          # JS cannot read it → safer
            secure=False,            # send only over HTTPS
            samesite="Lax",      
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
            {"sub": data['username'], "exp": datetime.now(timezone.utc) + timedelta(hours=1), 'public_id': userId},
            SECRETKEY,
            algorithm="HS256"
        )

        response = jsonify({"message": "logged in"})
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,          # JS cannot read it
            secure=False,            # send only over HTTPS
            samesite="Lax",    
            max_age=3600
        )
    else:
        #password does not match 
        response = jsonify({"message": "Sign up failed"})

    return response
        
#endpoint for already signed in users 
@bp.route('/auth/status', methods=["GET"])
@already_auth
def alreadyLoggedInUser():
    #checking if its already auth
    if request.alreadyAuth :
        print("log is already ", request.alreadyAuth)
        response = jsonify({"message": "logged in"})
        return response
    
    #not authed 
    response = jsonify({"error": "No user logged in"}) , 401
    return response

#endpoint for log out users
@bp.route('/logout', methods=['GET', 'POST','PUT'])
def userLogOut():

    if request.method == 'OPTIONS':
        # Preflight request — respond with empty 204
        return '', 204
    
    response = jsonify({"message": "Logged out"})
    response.set_cookie(
        key=COOKIE_NAME,
        value="",          # clear value
        httponly=True,
        secure=False,      
        samesite="Lax",    
        max_age=0         
    )
    return response
