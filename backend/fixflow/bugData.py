#File contains the views/bluepoints for API for getting data for bugs 
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
import random
from .auth_decorator import token_req

bp = Blueprint('data', __name__, url_prefix='/data')


#helper functions for multiple use 


#getting a bugs for a specific project 
def getBugData(id):
    bugs = g.db.execute(
        'SELECT * FROM bug WHERE projectid = ?',(id,)
    ).fetchall()
    bugDict =  [dict(row) for row in bugs]
    return bugDict

#getting all projects 
def getAllProjects():
    projs = g.db.execute("""
                           SELECT 
                            p.projectId,
                            p.title, p.tags, p.bugDate, p.team,
                            COUNT(b.bugId) AS bug_count
                            FROM 
                            project p
                            LEFT JOIN 
                            bug b ON p.projectId = b.projectId
                            GROUP BY 
                            p.projectId, p.title ;
                            """).fetchall()
    projsDict =  [dict(row) for row in projs]
    return projsDict

#getting all of user's project 
def getAllUserProjects(id):
    projs = g.db.execute("""
                           SELECT 
                            p.projectId,
                            p.title, p.tags, p.bugDate, p.team,
                            COUNT(b.bugId) AS bug_count
                            FROM 
                            project p
                            LEFT JOIN 
                            bug b ON p.projectId = b.projectId
                            WHERE userId = ?
                            GROUP BY 
                            p.projectId, p.title ;
                            """,(id,)).fetchall()
    projsDict =  [dict(row) for row in projs]
    return projsDict

#getting a specific project
def getOneProject(id):
    projs = g.db.execute("""
                           SELECT 
                            p.projectId,
                            p.title, p.tags, p.bugDate, p.team,
                            COUNT(b.bugId) AS bug_count
                            FROM 
                            project p
                            LEFT JOIN 
                            bug b ON p.projectId = b.projectId
                            WHERE p.projectId = ?
                            GROUP BY 
                            p.projectId, p.title ;
                            """, (id,)).fetchone()
    return dict(projs)



#endpoints for accessing data 


#endpoint of getting bugs data for given project id 
@bp.route('/bugdata', methods=['GET'])
@token_req
def bugdata():
    query = request.args.get('projectid')  # e.g., /bugdata?projectid=Pxxxx
    bugDict = getBugData(query)  
    return bugDict


#endpoint for getting all the projects 
@bp.route('/projectdata', methods=['GET'])
@token_req
def projectdata():
    user = request.user
    projsDict =  getAllUserProjects(user['userId'])
    return projsDict

#getting a specific project
@bp.route('/getproject', methods=['GET'])
@token_req
def getproject():
    projid = request.args.get('projectid')
    return getOneProject(projid)
    

#endpoint for updating or adding new bugs 
@bp.route('/addbug', methods=['POST','PUT'])
@token_req
def addbug():

    if request.method == 'OPTIONS':
        # Preflight request — respond with empty 204
        return '', 204
    
    data = request.get_json()
    #return message 
    message = ''
    resMessage = ''
    #update the table if PUT
    if request.method == 'PUT':
        #getting id of the bugs
        bugId = data['bugId']   # e.g., /bugdata?bugid=Pxxxx
        try:
            g.db.execute("""
        UPDATE bug
        SET title = ?, status = ?, priority = ?, assigned = ?, date = ?, projectId = ?
        WHERE bugId = ?
    """, (
        data['title'],
        data['status'],
        data['priority'],
        data['assigned'],
        data['date'],
        data['projectId'],
        bugId
        ))
            g.db.commit()  #  update permanent
            resMessage = 'Update successful'
        
        except:
            resMessage = 'Error Unsuccessful'
    #if adding new bug 
    else:
        try:
            g.db.execute("""
        INSERT INTO bug (title, status, priority, assigned, date, projectId)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data['title'],
        data['status'],
        data['priority'],
        data['assigned'],
        data['date'],
        data['projectId']
    ))
            g.db.commit()  #  update permanent
            resMessage = 'New bug added'
        except:
            resMessage = 'Error unsuccessful'

    #getting updated data
    message =  getBugData(data['projectId'])
    print(resMessage)
    return message, 200

#endpoint for updating or adding new project 
@bp.route('/addproject', methods=['POST','PUT' ,'OPTIONS'])
@token_req
def addproject():
    if request.method == 'OPTIONS':
        # Preflight request — respond with empty 204
        return '', 204


    data = request.get_json()
    #getting user id 
    user = request.user
    #converting a list to a string 
    data['tags'] =  ", ".join(data['tags'])
    #return message 
    dbResponse = 200
    message = ''
    resMessage = ''
    #update the table if PUT
    if request.method == 'PUT':
        #getting id of the bugs
        
        projId = data['projectId'] 
        
        # print(data['title'],
        # data['team'],
        # data['tags'],
        # data['bugDate'],
        # projId)

        try:
            g.db.execute("""
        UPDATE project
        SET title = ?, team = ?, tags = ?, bugDate = ?, userId = ?
        WHERE projectId = ?
    """, (
        data['title'],
        data['team'],
        data['tags'],
        data['bugDate'],
        user['userId'],
        projId
        ))
            g.db.commit()  #  update permanent
        
        except:
            message = 'Error Unsuccessful'
    #if adding new bug 
    else:
        #adding project id for the new projects
        num = random.randint(1, 10000)
        projId = f'PN{num}'
        try:
            g.db.execute("""
        INSERT INTO project  (title , team , tags, bugDate, userId, projectId )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data['title'],
        data['team'],
        data['tags'],
        data['bugDate'],
        user['userId'],
        projId
        ))
            g.db.commit()  #  update permanent
            resMessage = 'New bug added'
        except:
            resMessage = 'Error unsuccessful'

    #getting all the projects and return those 
    message =  getAllUserProjects(user['userId'])
    print(resMessage)
    return message, 200


#endpoint for deleting a project entery using project id
@bp.route('/removeproject', methods=['DELETE' ,'OPTIONS'])
@token_req
def deleteProject():
    if request.method == 'OPTIONS':
        # Preflight request — respond with empty 204
        return '', 204

    #getting project id 
    projectID = request.args.get('id', type=str)
    #return message 
    dbResponse = 200
    message = ''
    resMessage= ''
    #getting user id 
    user = request.user
    #deleting when method is ready 
    if request.method == 'DELETE':
        try:
            g.db.execute("""
                         DELETE FROM project
                        WHERE projectId = ?""",
                         (projectID,))
            g.db.commit()  #  update permanent
            resMessage = 'Project Deleted'
        except:
            resMessage = 'Error '
    #getting all the remaning projects 
    #getting all the projects and return those 
    message =  getAllUserProjects(user['userId'])
    print(resMessage)
    return message, 200

#endpoint for deleting a bug from project 
@bp.route('/removebug', methods=['DELETE' ,'OPTIONS'])
@token_req
def deleteBug():
    if request.method == 'OPTIONS':
        # Preflight request — respond with empty 204
        return '', 204

    #getting project id 
    project_id = request.args.get('projectid', type=str)
    #getting user id
    bugID = request.args.get('bugid', type=str)
    #return message 
    dbResponse = 200
    message = ''
    resMessage= ''
    #deleting when method is ready 
    if request.method == 'DELETE':
        try:
            g.db.execute("""
                         DELETE FROM bug
                        WHERE bugId = ?""",
                         (bugID,))
            g.db.commit()  #  update permanent
            resMessage = 'Project Deleted'
        except:
            resMessage = 'Error '
    #getting all the remaning projects 
    #getting all the projects and return those 
    message = getBugData(project_id)
    print(resMessage)
    return message, 200

