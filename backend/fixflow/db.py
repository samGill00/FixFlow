#Database intiatiation file
import sqlite3
from datetime import datetime
import os

import click
from flask import current_app, g

#function that opens a connection to the datbase
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db

#function for closing datbase connnection
def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db_path = os.path.join(current_app.instance_path, 'fixflow.db')
    if not os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        with current_app.open_resource('schema.sql') as f:
            conn.executescript(f.read().decode('utf8'))
            #click.echo('Initialized the database upon initiation.')
        #closing the connection
        conn.close()


#creating the database
@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


#defining how to interpret date and time 
sqlite3.register_converter(
    "timestamp", lambda v: datetime.fromisoformat(v.decode())
)


