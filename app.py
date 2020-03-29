from flask import Flask, render_template, request, send_file
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
DATABASE_LOCATION = "..\\Eva - Dependencies\\database.csv"
FOLDERS_LOCATION = "..\\Eva - Dependencies\\folders.txt"

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ui = FlaskUI(app=app,maximized=True)

Search.database_location = DATABASE_LOCATION
Search.update_data()

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/search')
def search():
    query = request.args.get('q') or ""
    raw = (request.args.get('raw') or "") != ""
    if query:
        results = Search.searchcsv(query)
        hits = len(results)
        if hits == 0:
            results_dict = [{'name':'No files were found!', 'path':'Please adjust your search criteria and try again.'}]
        else:   
            results_dict = results.to_dict('records')
        template = 'results.html' if not raw else 'results_raw.html'
        return render_template(template, results=results_dict, searchcriteria=query, hits=hits)
    else:
        return render_template('search.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/settings', methods=['GET', 'POST'])
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
    if not os.path.isfile(DATABASE_LOCATION):
        f = pd.DataFrame(columns = Search.COLUMNS)
        f.to_csv(DATABASE_LOCATION)

    if not os.path.isfile(FOLDERS_LOCATION):
        f = open(FOLDERS_LOCATION, "w+")
        f.close()

    app.run(debug=True)
    # serve(app, host='127.0.0.1', port=5000)

 
    