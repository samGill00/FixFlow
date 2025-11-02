import sqlite3
from datetime import datetime
import os
from flask import current_app, g


def get_bugs():
    error = None
    user = g.db.execute(
        'SELECT * FROM bug'
    )
    return user.fetchall()
