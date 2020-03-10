import os 
import hashlib
import numpy as np
import pandas as pd
from datetime import datetime

database_location = "..\\Eva - Dependencies\\database.csv"
folders_location = "..\\Eva - Dependencies\\folders.csv"

# Defining functions to be used - this is a tweaked version of the folderstats library

def calculate_hash(filepath, hash_name):
    """Calculate the hash of a file. The available hashes are given by the hashlib module. The available hashes can be listed with hashlib.algorithms_available."""

    hash_name = hash_name.lower()
    if not hasattr(hashlib, hash_name):
        raise Exception('Hash algorithm not available : {}'\
            .format(hash_name))

    with open(filepath, 'rb') as f:
        checksum = getattr(hashlib, hash_name)()
        for chunk in iter(lambda: f.read(4096), b''):
            checksum.update(chunk)

        return checksum.hexdigest()

def _recursive_folderstats(folderpath, items=[], hash_name=None,
                           ignore_hidden=False, depth=0, idx=1, parent_idx=0,
                           verbose=False):
    """Helper function that recursively collects folder statistics and returns current id, foldersize and number of files traversed."""
    foldersize, num_files = 0, 0
    current_idx = idx

    for f in os.listdir(folderpath):
        if ignore_hidden and f.startswith('.'):
            continue

        filepath = os.path.join(folderpath, f)
        stats = os.stat(filepath)
        foldersize += stats.st_size
        idx += 1
        try:
            if os.path.isdir(filepath):
                if verbose:
                    print('FOLDER : {}'.format(filepath))

                idx, items, _foldersize, _num_files = _recursive_folderstats(
                    filepath, items, hash_name,
                    ignore_hidden, depth + 1, idx, current_idx, verbose)
                foldersize += _foldersize
                num_files += _num_files
            else:
                filename, extension = os.path.splitext(f)
                extension = extension[1:] if extension else None
                item = [idx, filepath, filename, extension, stats.st_size,
                        stats.st_atime, stats.st_mtime, stats.st_ctime,
                        False, None, depth, current_idx]
                if hash_name:
                    item.append(calculate_hash(filepath, hash_name))
                items.append(item)
                num_files += 1
        except:
        # if for whatever reason we can't open the folder, pass - this was the tweak
            pass       

    stats = os.stat(folderpath)
    foldername = os.path.basename(folderpath)
    item = [current_idx, folderpath, foldername, None, foldersize,
            stats.st_atime, stats.st_mtime, stats.st_ctime,
            True, num_files, depth, parent_idx]
    if hash_name:
        item.append(None)
    items.append(item)

    return idx, items, foldersize, num_files

def folderstats(folderpath, hash_name=None, microseconds=False,
                absolute_paths=False, ignore_hidden=False, parent=True,
                verbose=False):
    """Function that returns a Pandas dataframe from the folders and files from a selected folder."""
    columns = ['id', 'path', 'name', 'extension', 'size',
               'atime', 'mtime', 'ctime',
               'folder', 'num_files', 'depth', 'parent']
    if hash_name:
        hash_name = hash_name.lower()
        columns.append(hash_name)

    idx, items, foldersize, num_files = _recursive_folderstats(
        folderpath,
        hash_name=hash_name,
        ignore_hidden=ignore_hidden,
        verbose=verbose)
    df = pd.DataFrame(items, columns=columns)

    for col in ['atime', 'mtime', 'ctime']:
        df[col] = df[col].apply(
            lambda d: datetime.fromtimestamp(d) if microseconds else \
                datetime.fromtimestamp(d).replace(microsecond=0))

    if absolute_paths:
        df.insert(1, 'absolute_path', df['path'].apply(
            lambda p: os.path.abspath(p)))

    if not parent:
        df.drop(columns=['id', 'parent'], inplace=True)

    return df

def read_folders():
    folders = pd.read_csv(folders_location,names = ['folders'])
    folder_1 = folders.iloc[1].folders
    folder_2 = folders.iloc[2].folders
    folder_3 = folders.iloc[3].folders

    return(folder_1,folder_2,folder_3)

def write_folders(folder_1,folder_2,folder_3):
    frames = [folder_1,folder_2,folder_3]
    df = pd.DataFrame(frames)
    df.to_csv(folders_location)

# Update function
def update():
    '''This function is used to update the df that powers the search function.'''
    
    folder_1,folder_2,folder_3 = read_folders() # These are the folders we crawl through to collect information
    
    try:
        data_1 = folderstats(folder_1, ignore_hidden=True)
    except:
        data_1 = pd.DataFrame()
    try:
        data_2 = folderstats(folder_2, ignore_hidden=True)
    except:
        data_2 = pd.DataFrame()
    try:
        data_3 = folderstats(folder_3, ignore_hidden=True)
    except:
        data_3 = pd.DataFrame()

    frames = [data_1,data_2,data_3] #  We combine the dataframes
    df = pd.concat(frames)

    df = df[df['folder'] == False] # remove folders from list
    df = df[df['name'] != None] # remove all files with no names
    df = df.drop(df.columns[[0,4,7,8,9,10,11]],axis=1) # drop columns we aren't using
    df['name'] = df['name'] + '.' + df['extension'] # adding file extensions to the name
    df = df.drop(df.columns[2],axis=1) # drop column we aren't using
    df['id'] = np.arange(len(df)) # We give each file an id

    #  Save the file to the drive
    df.to_csv(database_location)