#helper functions 
#file supplies funtion and endpoints to login and verify user 
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from datetime import datetime, timedelta, timezone
import jwt
import bcrypt
import random

#function that hashes password and  returns the hashed pass
def hashPass(userPass):
    password_bytes = userPass.encode('utf-8')
    # Generate a salt and hash the password
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    hashed_str = hashed_password.decode('utf-8')
    return hashed_str

#function that checks and compare hashed passwords 
def checkHasedPass(givenPass, storedPass):
    provided_password_bytes = givenPass.encode('utf-8')
    stored_hash = storedPass.encode('utf-8') 
    return bcrypt.checkpw(provided_password_bytes, stored_hash)


#funtion that provides a specific user using username 
def getUser(username):
    user = g.db.execute(
        'SELECT * FROM user WHERE username = ?',(username,)
    ).fetchone()
    print(dict(user))
    return dict(user)

def getUserWithId(userId):
    user = g.db.execute(
        'SELECT * FROM user WHERE UserId = ?',(userId,)
    ).fetchone()

    return dict(user)

