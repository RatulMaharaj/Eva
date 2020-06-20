import os, stat
from datetime import datetime
from pathlib import Path

LOCATION = 'path'
NAME = 'name'
IS_FOLDER = 'is_folder'
DEPTH = 'path_depth'
SIZE = 'size_bytes'
ATIME = 'accessed_time'
MTIME = 'modified_time'
CTIME = 'created_time'
READONLY = 'readonly'
HIDDEN = 'hidden'
SYSTEM = 'system'

FOLDER_SIZE = 'folder_size_bytes'
NUM_FILES = 'num_files'
NUM_FOLDERS = 'num_subfolders'

def index_folder(path):
    '''
        return a generator of scandir results for all the files and folders in a folder, including total size, filecount and foldercount for each folder
    '''

    root_dict = path if isinstance(path, dict) else dict_for_one_folder(path)
    root_dict[FOLDER_SIZE] = root_dict[NUM_FILES] = root_dict[NUM_FOLDERS] = 0
    root_location = root_dict[LOCATION]
    root_location = root_location + (os.path.sep if os.path.sep not in root_location and root_location != '' else '')

    root_str = os.path.join(root_location,root_dict[NAME])
    if '/' not in root_str and '\\' not in root_str: 
        root_str = root_str + '\\'
    for dir_entry in os.scandir(root_str):
        entry_dict = direntry_to_dict(dir_entry)
        if entry_dict[IS_FOLDER]: #If the child is a folder
            try:
                for descendant in index_folder(entry_dict):
                    root_dict[FOLDER_SIZE] += descendant[SIZE]
                    if descendant[IS_FOLDER]:
                        root_dict[NUM_FOLDERS] += 1
                    else:
                        root_dict[NUM_FILES] += 1
                    yield descendant 
            except PermissionError:
                yield entry_dict
        else: # if the child is a file
            root_dict[FOLDER_SIZE] += entry_dict[SIZE]
            root_dict[NUM_FILES] += 1
            yield entry_dict
    yield root_dict


def direntry_to_dict(de):
    '''
        convert a direntry object to a simple dict
    '''
    result = {
        LOCATION: os.path.normpath(os.path.split(de.path)[0]).rstrip('\\'),
        NAME: de.name,
        IS_FOLDER: de.is_dir(),
        DEPTH: len(Path(de.path).parents),
    }
    stat_to_dict(de.stat(), result)
    return result


def stat_to_dict(stats, results_dict = {}):
    '''
        convert a stat object to a simple dict
        or append it to an existing dict
    '''
    
    results_dict[SIZE]  = stats.st_size
    results_dict[ATIME] = datetime.fromtimestamp(stats.st_atime).replace(microsecond = 0)
    results_dict[MTIME] = datetime.fromtimestamp(stats.st_mtime).replace(microsecond = 0)
    results_dict[CTIME] = datetime.fromtimestamp(stats.st_ctime).replace(microsecond = 0)
    
    if os.name == 'nt': # Only on Windows
        attributes = stats.st_file_attributes
        results_dict[READONLY] = (stat.FILE_ATTRIBUTE_READONLY & attributes) != 0
        results_dict[HIDDEN] = (stat.FILE_ATTRIBUTE_HIDDEN & attributes) != 0
        results_dict[SYSTEM] = (stat.FILE_ATTRIBUTE_SYSTEM & attributes) != 0
    
    return results_dict


def dict_for_one_folder(path):
    '''
        returns a single DirEntry object for one path
    '''
    if Path(path).anchor == path:
        return {
            LOCATION: '',
            NAME: path,
            IS_FOLDER: True,
            DEPTH: len(Path(path).parents),
            SIZE: 0,
            ATIME: datetime.fromisoformat('1900-01-01 00:00').replace(microsecond = 0),
            MTIME: datetime.fromisoformat('1900-01-01 00:00').replace(microsecond = 0),
            CTIME: datetime.fromisoformat('1900-01-01 00:00').replace(microsecond = 0),
            READONLY: False,
            HIDDEN: False,
            SYSTEM: False,
        }

    base, name = os.path.split(path)
    for entry in os.scandir(base):
        if entry.name == name:
            return direntry_to_dict(entry)