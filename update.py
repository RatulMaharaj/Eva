import numpy as np
import pandas as pd
from src.folderstats import folderstats

database_location = "..\\Eva - Dependencies\\database.csv"
folders_location = "..\\Eva - Dependencies\\folders.txt"

def read_folders():
    with open(folders_location, 'r') as f:
        text = f.read()
    folders = text.split('\n')
    print(folders)
    return folders

def write_folders(folders):
    text = '\n'.join(folders)
    with open(folders_location, 'w') as f:
        f.write(text)

# Update function
def update():
    '''This function is used to update the df that powers the search function.'''
    
    folders = read_folders() # These are the folders we crawl through to collect information
    
    def safe_folderstats(f):
        try:
            return folderstats(f, ignore_hidden=True)
        except:
            return pd.DataFrame()

    frames = [safe_folderstats(f) for f in folders]
    print("Frames:")
    print(frames)
    print("df:")
    df = pd.concat(frames)
    print(df.head())

    # df = df[df['folder'] == False] # remove folders from list
    df = df[df['name'] != ""] # remove all files with no names
    df = df.drop(df.columns[[0,4,7,8,9,10,11]],axis=1) # drop columns we aren't using
    df['name'] = df['name'] + '.' + df['extension'] # adding file extensions to the name
    df = df.dropna(axis=0) # remove null rows
    df = df.drop(df.columns[2],axis=1) # drop column we aren't using
    df['id'] = np.arange(len(df)) # We give each file an id

    #  Save the file to the drive
    df.to_csv(database_location)