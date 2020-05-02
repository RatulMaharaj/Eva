from flask import Flask, render_template, request, send_file, redirect, url_for, session
from flask_session import Session
from tempfile import mkdtemp
from functools import wraps
from update import update, read_folders, write_folders
from encrypt import encrypt_file
import search as Search
from combine import merge_pdfs
import pandas as pd
import json
import os, glob
from waitress import serve

version = '0.2.0'

UPLOAD_FOLDER = ".\\uploads"
DEP_FOLDER = "..\\Eva - Dependencies\\"
DATABASE_LOCATION = DEP_FOLDER + "database.csv"
FOLDERS_LOCATION = DEP_FOLDER + "folders.txt"

DEFAULT_SEARCH_RESULT_LIMIT = 100

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

Search.database_location = DATABASE_LOCATION
Search.update_data()

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    session.clear() # Forget any user_id

    if request.method == "POST":
        if request.form.get("password") != "OMART@6H":
            print(request.form.get('password'))
            error = "Incorrect Credentials, Please try again"
            return render_template('login.html', error=error)

        session["user_id"] = 123 # Set a session ID if correct password is entered

        return redirect("/")
    else:
        return render_template("login.html")

@app.route('/')
@login_required
def home():
    return render_template('home.html')

@app.route('/search')
@login_required
def search():
    query = request.args.get('q') or ""
    raw = (request.args.get('raw') or "") != ""
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
        template = 'results.html' if not raw else 'results_raw.html'
        return render_template(template, results=results_dict, searchcriteria=query, hits=hits, returned_hits=returned_hits)
    else:
        return render_template('search.html')

@app.route('/about')
@login_required
def about():
    return render_template('about.html')

@app.route('/settings', methods=['GET', 'POST'])
@login_required
def update_data():
    folders = read_folders(FOLDERS_LOCATION)
    
    if request.method == 'POST':
        folders = request.form['folders'].splitlines()
        write_folders(folders, FOLDERS_LOCATION)
        update(DATABASE_LOCATION, FOLDERS_LOCATION)
        Search.update_data()

    folders_str = '\n'.join(folders)
    modtime = Search.getmodtime()
    return render_template('update.html',modtime = modtime, version = version, folders=folders_str)


def clear_uploads():
    files = glob.glob(UPLOAD_FOLDER+'\\*')
    for file in files:
        os.remove(file)

@app.route('/combine', methods=['GET','POST'])
@login_required
def combine():
    if request.method == 'POST':
        clear_uploads()
        try:
            files = request.files.getlist("files")
            password = request.form.get('password')
            names = []
            print("The password is:",password)
            for file in files: # save files to folder
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
                names.append(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            
            names.sort()

            merge_pdfs(names, output=os.path.join(app.config['UPLOAD_FOLDER'],'merged.pdf'))

            if password != "":
                print('The password is not blank')
                encrypt_file(os.path.join(app.config['UPLOAD_FOLDER'],'merged.pdf'), password, mode = "encrypt")
                return send_file(os.path.join(app.config['UPLOAD_FOLDER'],'merged_encrypted.pdf'), as_attachment=True)
            return send_file(os.path.join(app.config['UPLOAD_FOLDER'],'merged.pdf'), as_attachment=True)
        except:
            return render_template('combine.html')
    else:
        return render_template('combine.html')

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

 
    