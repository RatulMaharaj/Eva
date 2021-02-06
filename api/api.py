import datetime
from flask import Flask, render_template, request, send_file, redirect, jsonify, abort
from src.update import update, read_folders, write_folders
import src.search as Search
import pandas as pd
import json
import os, glob
from waitress import serve
import subprocess

version = '0.3.0'

# Set app parameters

# UPLOAD_FOLDER = ".\\uploads"
DEP_FOLDER = "..\\dependencies"
DATABASE_LOCATION = DEP_FOLDER + "\\" + "database.csv"
FOLDERS_LOCATION = DEP_FOLDER + "\\" + "folders.txt"
DEFAULT_SEARCH_RESULT_LIMIT = 100
IS_UPDATING = 'no'

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
    query = request.args.get('q')
    # raw = (request.args.get('raw') or "") != ""
    limit = int(request.args.get('limit') or DEFAULT_SEARCH_RESULT_LIMIT)
    if query == "":
        results_dict = []
        return jsonify(results=results_dict, searchcriteria=query, hits=0, returned_hits=0)
    
    elif query:
        results = Search.searchcsv(query)
        hits = len(results)
        if hits == 0:
            returned_hits = 0
            results_dict = []
        else:
            if limit > 0 and hits > limit:
                results = results.head(limit)
            returned_hits = len(results)
            results_dict = results.to_dict('records')
        return jsonify(results=results_dict, searchcriteria=query, hits=hits, returned_hits=returned_hits)
    else:
        return "No valid query parameters used"

@app.route('/api/browse')
def browse():
    path = request.args.get('path')
    results = Search.get_path(path).to_dict('records') if path else []
    return jsonify(path=path, results = results)

@app.route('/api/data')
def data():
    offset = int(request.args.get('offset') or 0)
    limit = int(request.args.get('limit') or DEFAULT_SEARCH_RESULT_LIMIT)
    results = Search.data[offset:].head(limit).to_dict('records')
    num_rows = len(Search.data)
    return jsonify(num_rows=num_rows, num_results = limit, results = results)
    
@app.route('/api/export')
def export():
    try: 
        return send_file(DATABASE_LOCATION, as_attachment = True)
    except FileNotFoundError:
        abort(404)

@app.route('/api/settings', methods=['GET', 'POST'])
def update_data():
    if request.method == 'POST':
        global IS_UPDATING 
        IS_UPDATING = 'yes'
        data = request.get_json()
        folders = data['folders'].splitlines()
        write_folders(folders, FOLDERS_LOCATION)
        update(DATABASE_LOCATION, FOLDERS_LOCATION)
        Search.load_data()
        IS_UPDATING = 'no'        
        return jsonify(message="update successful")

    folders = read_folders(FOLDERS_LOCATION)
    folders_str = '\n'.join(folders)
    modtime = Search.getmodtime()

    return jsonify(modtime = modtime, version = version, folders=folders_str, isUpdating=IS_UPDATING)


@app.route('/api/open')
def open():
    path = request.args.get('path')
    subprocess.Popen(["explorer", path])
    return 'success'

if __name__ == '__main__':
    # Create dependencies that don't exist if needed
    if not os.path.isdir(DEP_FOLDER):
        os.mkdir(DEP_FOLDER)
        
    if not os.path.isfile(DATABASE_LOCATION):
        f = pd.DataFrame(columns = Search.COLUMNS)
        f.to_csv(DATABASE_LOCATION)

    if not os.path.isfile(FOLDERS_LOCATION):
        f = open(FOLDERS_LOCATION, "w+")
        f.close()

    app.run(debug=True)
    # serve(app, host='127.0.0.1', port=5050)