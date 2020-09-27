# Importing the required libraries
import numpy as np
import pandas as pd
import os
import time
from shlex import split
from src.index_folder import NAME, LOCATION, IS_FOLDER, SIZE, ATIME, MTIME, CTIME, HIDDEN, SYSTEM, READONLY, NUM_FILES, NUM_FOLDERS, FOLDER_SIZE

COLUMNS = [NAME, LOCATION, IS_FOLDER, SIZE, ATIME, MTIME, CTIME, HIDDEN, SYSTEM, READONLY, NUM_FILES, NUM_FOLDERS, FOLDER_SIZE] # The fields we want from the datafile

data = pd.DataFrame(columns = COLUMNS) #initialise an empty dataframe

def load_data():
    # Import Database
    global data
    try:
        data = pd.read_csv(database_location, usecols = COLUMNS, low_memory = False) # Read the data into a pandas dataframe
    except:
        pass # fail silently
    
# Search function
def searchcsv(search_string, within = ''):
    '''
    This function can be used to search for files saved in the OMART folders.
    '''
    try:
        search_words = split(search_string)
    except: # if shlex split fails (can happen if there's unclosed quotes)
        search_words = search_string.split(' ')

    filtered = data[data['is_folder'] == False]
    if within:
        filtered = filtered[filtered['path'].str.lower().startswith(within)]
    for search_word in search_words:
        filtered = filtered[filtered['name'].str.contains(search_word, case=False)]
    
    results = filtered
    return results

def get_path(path):
    return data[data['path'].str.lower() == path.lower()].sort_values([HIDDEN, IS_FOLDER, NAME], ascending = [False, False, True])            

def getmodtime():
    modified = os.path.getmtime(database_location)
    year,month,day,hour,minute,second = time.localtime(modified)[:-3]
    modtime =  ("%02d/%02d/%d %02d:%02d:%02d"%(day,month,year,hour,minute,second))
    return modtime
