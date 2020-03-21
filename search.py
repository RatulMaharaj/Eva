# Importing the required libraries
import numpy as np
import pandas as pd
import os
import time
from shlex import split


COLUMNS = ['name','path'] # The fields we want from the datafile

database_location = ""
data = pd.DataFrame(columns = COLUMNS) #initialise an empty dataframe

def update_data():
    # Import Database
    global data
    try:
        data = pd.read_csv(database_location, usecols = COLUMNS, low_memory = False) # Read the data into a pandas dataframe
    except:
        pass # fail silently
    
# Search function
def searchcsv(search_string):
    '''
    This function can be used to search for files saved in the OMART folders.
    '''
    try:
        search_words = split(search_string)
    except: # if shlex split fails (can happen if there's unclosed quotes)
        search_words = search_string.split(' ')

    filtered = data
    for search_word in search_words:
        filtered = filtered[filtered['name'].str.contains(search_word, case=False)]
    
    results = filtered
    return results[['name','path']]            

def getmodtime():
    modified = os.path.getmtime(database_location)
    year,month,day,hour,minute,second = time.localtime(modified)[:-3]
    modtime =  ("%02d/%02d/%d %02d:%02d:%02d"%(day,month,year,hour,minute,second))
    return modtime
