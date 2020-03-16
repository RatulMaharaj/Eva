from flask import Flask, render_template, request, send_file
from update import update, read_folders, write_folders
from search import getmodtime, searchcsv
from combine import merge_pdfs
import pandas as pd
import json
import os, glob
from waitress import serve
# from flaskwebgui import FlaskUI 

version = '0.1.0'

UPLOAD_FOLDER = ".\\CombineUploads"

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ui = FlaskUI(app=app,maximized=True)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/search-results',methods = ['GET','POST'])    
def results():
    searchcriteria = request.form['searchcriteria']
    results, hits = searchcsv(searchcriteria)
    if type(results) == str:
        results = {'name':{0:'No files were found!'},'path':{0:'Please adjust your search criteria and try again.'}}
    else:    
        results = results.to_json()
        results = json.loads(results)
    return render_template('results.html', results=results, searchcriteria=searchcriteria, hits=hits)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/settings', methods=['GET', 'POST'])
def update_data():
    folders = read_folders()
    folders_str = '\n'.join(folders)
    
    if request.method == 'POST':
        folders = request.form['folders'].splitlines()
        write_folders(folders)
        update()

    modtime = getmodtime()
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
            names = []

            for file in files: # save files to folder
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
                names.append(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            
            names.sort()

            merge_pdfs(names, output=os.path.join(app.config['UPLOAD_FOLDER'],'merged.pdf'))
            return send_file(os.path.join(app.config['UPLOAD_FOLDER'],'merged.pdf'), as_attachment=True)
        except:
            return render_template('combine.html')
    else:
        return render_template('combine.html')

if __name__ == '__main__':
    # app.secret_key = 'mysecret'
    app.run(debug=True)
    # ui.run()
    # serve(app, host='127.0.0.1', port=5000)


    