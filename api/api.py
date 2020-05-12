import datetime
from flask import Flask, render_template, request, send_file, jsonify
from src.update import update, read_folders, write_folders
import src.search as Search
import pandas as pd
import json
import os, glob
from waitress import serve

version = '0.3.0'

# Set app parameters

# UPLOAD_FOLDER = ".\\uploads"
DEP_FOLDER = "..\\dependencies\\"
DATABASE_LOCATION = DEP_FOLDER + "database.csv"
FOLDERS_LOCATION = DEP_FOLDER + "folders.txt"
DEFAULT_SEARCH_RESULT_LIMIT = 100

# Create dependencies that don't exist if needed

if not os.path.isdir(DEP_FOLDER):
    os.mkdir(DEP_FOLDER)
    
if not os.path.isfile(DATABASE_LOCATION):
    f = pd.DataFrame(columns = Search.COLUMNS)
    f.to_csv(DATABASE_LOCATION)

if not os.path.isfile(FOLDERS_LOCATION):
    f = open(FOLDERS_LOCATION, "w+")
    f.close()

# Create app instance
app = Flask(__name__, static_folder="../build",static_url_path="/")

# Serve built react app
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Api endpoints
@app.route('/api/message')
def get_current_time():
    return {'message' : "Hello from Flask!" }
