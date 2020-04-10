import os, stat, csv ,sys
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

def all_files_in_folder(path):
    return walk_scandir_dict(path)

def walk_scandir(path, recursive = True):
    '''
        return a generator of scandir results (DirEntry results) for a folder and it's subfolders
    '''
    for de in os.scandir(path):
        yield de
        if de.is_dir() and recursive:
            try:
                yield from walk_scandir(de.path, recursive = recursive)
            except PermissionError:
                pass

def walk_scandir_dict(path, recursive = True):
    '''
        return file and folder stats for a folder and its subfolders
        in a generator of dicts
    '''
    for de in walk_scandir(path, recursive):
        yield direntry_to_dict(de)

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


def direntry_to_dict(de):
    '''
        convert a direntry object to a simple dict
    '''
    result = {
        LOCATION: os.path.normpath(os.path.split(de.path)[0]),
        NAME: de.name,
        ISFOLDER: de.is_dir(),
    }
    stat_to_dict(de.stat(), result)
    return result


def dict_list_to_csv(dict_list, path):
    '''
        write a list of dicts to a csv file
    '''
    iterable = iter(dict_list)
    first = next(iterable) # get first entry
    keys = first.keys() # get keys of 1st entry
    with open(path, 'w', newline = '\n', encoding='utf-8') as f:
        dw = csv.DictWriter(f,keys)
        dw.writeheader()
        dw.writerow(first) # write the first row
        dw.writerows(iterable) # write the rest

def folder_to_csv(source_path, csv_path):
    the_list = list(walk_scandir_dict(source_path))
    dict_list_to_csv(the_list, csv_path)
    return the_list