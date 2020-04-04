# Importing the required libraries
import numpy as np
import pandas as pd
import os
import time
from shlex import split
import sqlite3


COLUMNS = ['name','path'] # The fields we want from the datafile
data = pd.DataFrame(columns = COLUMNS) # initialise an empty dataframe

def update_database(database_location):
    # Import Database
    global data
    try:
        conn = sqlite3.connect(database_location)
        data = pd.read_sql_query('SELECT * FROM ask_eva', conn)
        conn.close()
    except:
        pass # fail silently
    
# Search function
def search_db(search_string):
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

def get_times(database_location):
    modified = os.path.getmtime(database_location)
    year,month,day,hour,minute,second = time.localtime(modified)[:-3]
    modtime =  ("%02d/%02d/%d %02d:%02d:%02d"%(day,month,year,hour,minute,second))

    conn = sqlite3.connect(database_location)
    update_time = pd.read_sql_query('SELECT * FROM update_time', conn).loc[0,'update_time']
    conn.close()

    return (modtime, update_time)
