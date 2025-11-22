#application factory it holds the  flask app (server)
import os 
from flask import Flask
from .db import get_db, close_db, init_db, init_db_command
from .query import get_bugs
from flask_cors import CORS

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    ##cors for cross port access
    CORS(app,  supports_credentials=True, expose_headers=["Authorization"])
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'fixflow.db'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    

    #funtion that checks if database is intialised or not 
    with app.app_context():
        from .db import init_db
        init_db()
        


    @app.before_request
    def open_db_connection():
        get_db()  # Opens connection and stores in `g`

    @app.teardown_request
    def close_db_connection(exception):
        close_db()  # Closes connection after request



    #providing a cli command to manualy check or create a database 
    app.cli.add_command(init_db_command)

    #adding blueprints 
    from . import bugData, auth_login
    #this is for getting bugs data
    app.register_blueprint(bugData.bp)
    #this bp is for logging user in 
    app.register_blueprint(auth_login.bp)
    

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        users = get_bugs()
        userDict =  [dict(row) for row in users]

        for r in users :
            print(dict(r))
        return f'Hello, World! \n {userDict} '

    return app