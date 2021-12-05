from flask import Flask, request, jsonify
from src.update import update, read_folders, write_folders
import src.search as Search
import pandas as pd
import os
import platform
import sqlite3

# import json
# from waitress import serve

version = "1.0.0"

# Set app parameters
if platform.system() == "Darwin":
    DEP_FOLDER = "../dependencies/"  # unix
else:
    DEP_FOLDER = "..\\dependencies\\"  # Windows

DATABASE_LOCATION = DEP_FOLDER + "database.db"
FOLDERS_LOCATION = DEP_FOLDER + "folders.txt"
DEFAULT_SEARCH_RESULT_LIMIT = 100
IS_UPDATING = "no"

# Create dependencies that don't exist if needed

if not os.path.isdir(DEP_FOLDER):
    os.mkdir(DEP_FOLDER)
if not os.path.isfile(DATABASE_LOCATION):
    conn = sqlite3.connect(DATABASE_LOCATION)  # This will create an empty db
    conn.close()
if not os.path.isfile(FOLDERS_LOCATION):
    f = open(FOLDERS_LOCATION, "w+")
    f.close()

# Create app instance
app = Flask(__name__, static_folder="../build", static_url_path="/")

# Search.database_location = DATABASE_LOCATION
# Search.load_data()


# Serve built react app
@app.route("/")
def index():
    return app.send_static_file("index.html")


# api endpoints


@app.route("/api/os", methods=["GET"])
def os():
    if platform.system() == "Darwin":
        return jsonify(os="macos")
    else:
        return jsonify(os="windows")


@app.route("/api/search", methods=["GET"])
def search():
    query = request.args.get("q")
    # raw = (request.args.get('raw') or "") != ""
    limit = int(request.args.get("limit") or DEFAULT_SEARCH_RESULT_LIMIT)
    if query == "":
        results_dict = [
            {
                "name": "Search for a file",
                "path": "Use the search box above to find a file on the share drives",
            }
        ]
        return jsonify(
            results=results_dict, searchcriteria=query, hits=0, returned_hits=0
        )

    elif query:
        results = Search.search_db(query, DATABASE_LOCATION)
        hits = len(results)
        if hits == 0:
            returned_hits = 0
            results_dict = [
                {
                    "name": "No files were found!",
                    "path": "Please adjust your search criteria and try again.",
                }
            ]
        else:
            if limit > 0 and hits > limit:
                results = results.head(limit)
            returned_hits = len(results)
            results_dict = results.to_dict("records")
        return jsonify(
            results=results_dict,
            searchcriteria=query,
            hits=hits,
            returned_hits=returned_hits,
        )
    else:
        return "No valid query parameters used"


@app.route("/api/settings", methods=["GET", "POST"])
def update_data():
    if request.method == "POST":
        global IS_UPDATING
        IS_UPDATING = "yes"
        data = request.get_json()
        folders = data["folders"].splitlines()
        write_folders(folders, FOLDERS_LOCATION)
        update(DATABASE_LOCATION, FOLDERS_LOCATION)
        IS_UPDATING = "no"
        return jsonify(message="update successful")

    folders = read_folders(FOLDERS_LOCATION)
    folders_str = "\n".join(folders)
    modtime, update_time = Search.get_times(DATABASE_LOCATION)

    return jsonify(
        modtime=modtime,
        updatetime=update_time,
        version=version,
        folders=folders_str,
        isUpdating=IS_UPDATING,
    )
