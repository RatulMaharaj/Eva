import datetime
from flask import Flask, render_template, request, send_file, redirect, jsonify
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

Search.database_location = DATABASE_LOCATION
Search.load_data()

# Serve built react app
@app.route('/')
def index():
    return app.send_static_file('index.html')

# api endpoints
@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('q') or ""
    # raw = (request.args.get('raw') or "") != ""
    limit = int(request.args.get('limit') or DEFAULT_SEARCH_RESULT_LIMIT)
    if query:
        results = Search.searchcsv(query)
        hits = len(results)
        if hits == 0:
            returned_hits = 0
            results_dict = [{'name':'No files were found!', 'path':'Please adjust your search criteria and try again.'}]
        else:
            if limit > 0 and hits > limit:
                results = results.head(limit)
            returned_hits = len(results)
            results_dict = results.to_dict('records')
        return jsonify(results=results_dict, searchcriteria=query, hits=hits, returned_hits=returned_hits)
    else:
        return "No valid query parameters used"

@app.route('/api/settings', methods=['GET', 'POST'])
def update_data():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        folders = data['folders'].splitlines()
        print(folders)
        write_folders(folders, FOLDERS_LOCATION)
        update(DATABASE_LOCATION, FOLDERS_LOCATION)
        Search.load_data()        
        return jsonify(message="Update Successful")

    folders = read_folders(FOLDERS_LOCATION)
    folders_str = '\n'.join(folders)
    modtime = Search.getmodtime()

    return jsonify(modtime = modtime, version = version, folders=folders_str)