#This file contains all the decorator funtion used by the application 

from functools import wraps
from flask import request, jsonify
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from login import getUserWithId

#Secret key variable 
SECRETKEY = 'my-key'
#cookie name 
COOKIE_NAME = 'access_token'

#funtion that authenticate the using token 
def token_req(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.cookies.get(COOKIE_NAME)

        if not token:
            return jsonify({"error": "Missing token"}), 401

        try:
            decoded = jwt.decode(token, SECRETKEY, algorithms=["HS256"])
            #getting user 
            user = getUserWithId(decoded.get('public_id'))

            #checking if user exist 
            if not user:  # Ensure the user exists
                return jsonify({"message": "User not found!"}), 404
            
        except ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401

        except InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        #returning user 
        request.user = user

        return f(*args, **kwargs)
    
    return decorator