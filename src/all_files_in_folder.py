import os, stat
import pandas as pd
import sys
from datetime import datetime

LOCATION = 'path'
NAME = 'name'
ISFOLDER = 'is_folder'
SIZE = 'size_bytes'
ATIME = 'accessed_time'
MTIME = 'modified_time'
CTIME = 'created_time'
READONLY = 'readonly'
HIDDEN = 'hidden'
SYSTEM = 'system'

def all_files_in_folder(root_folder, include_stats = False, include_folders = False):
    '''
        returns a list of dicts of all the files (and optionally folders) in a folder and its subfolders
    '''
    results = []
    for root, folders, files in os.walk(root_folder):
        fullnames   = [{LOCATION: root, NAME: file, ISFOLDER: False} for file in files]
        if include_folders:
            fullnames_folders = [{LOCATION: root, NAME: folder, ISFOLDER: True } for folder in folders]
            fullnames = fullnames + fullnames_folders
        if include_stats:
            for fullname in fullnames:
                stats = os.stat(os.path.join(fullname[LOCATION], fullname[NAME]))
                fullname[SIZE]  = stats.st_size
                fullname[ATIME] = datetime.fromtimestamp(stats.st_atime).replace(microsecond = 0)
                fullname[MTIME] = datetime.fromtimestamp(stats.st_mtime).replace(microsecond = 0)
                fullname[CTIME] = datetime.fromtimestamp(stats.st_ctime).replace(microsecond = 0)
                if os.name == 'nt': # Only on Windows
                    attributes = stats.st_file_attributes
                    fullname[READONLY] = (stat.FILE_ATTRIBUTE_READONLY & attributes) != 0
                    fullname[HIDDEN] = (stat.FILE_ATTRIBUTE_HIDDEN & attributes) != 0
                    fullname[SYSTEM] = (stat.FILE_ATTRIBUTE_SYSTEM & attributes) != 0
        results.extend(fullnames)
    return results


def all_files_in_folder_to_txt(root_folder, text_file = None):
    files = all_files_in_folder(root_folder)
    string = '\n'.join([os.path.join(f[LOCATION], f[NAME]) for f in files])
    if text_file:
        with open(text_file, 'w', encoding='utf-8') as f:
            f.write(string)
    return string


def all_files_in_folder_to_csv(root_folder, csv_file = None, include_stats = False, include_folders = False):
    all_files = all_files_in_folder(root_folder, include_stats)
    df = pd.DataFrame(all_files)
    if csv_file:
        df.to_csv(csv_file, index=False)
    return df

if __name__ == '__main__':
    _, root_folder, filename, *rest = sys.argv
    all_files_in_folder_to_csv(root_folder, filename, include_stats = True)
