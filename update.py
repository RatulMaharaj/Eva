import pandas as pd
from src.all_files_in_folder import all_files_in_folder
import sqlite3

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
    frames = [pd.DataFrame(all_files_in_folder(f)) for f in source_folders]
    df = pd.concat(frames)

    conn = sqlite3.connect(database_location)
    df.to_sql("askEva", conn, if_exists="replace")
    conn.close()