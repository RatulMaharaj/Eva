import pandas as pd
from .index_folder import index_folder

def read_folders(folders_location):
    with open(folders_location, 'r') as f:
        text = f.read()
    folders = text.split('\n')
    return folders

def write_folders(folders, folders_location):
    text = '\n'.join(folders)
    with open(folders_location, 'w') as f:
        f.write(text)

def update(database_location, folders_location):
     # These are the folders we crawl through to collect information
    source_folders = read_folders(folders_location)
    frames = [pd.DataFrame(index_folder(f),) for f in source_folders]
    df = pd.concat(frames)
    df.fillna(0)
    df.to_csv(database_location, index = False, na_rep=0)