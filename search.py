# Importing the required libraries
import numpy as np
import pandas as pd
import os
import time
from shlex import split
import sqlite3


COLUMNS = ['name','path'] # The fields we want from the datafile
data = pd.DataFrame(columns = COLUMNS) # initialise an empty dataframe
    
# Search function
def search_db(search_string, database_location):
    '''
    This function can be used to search for files saved in the OMART folders.
    '''
    try:
        search_words = split(search_string)
    except: # if shlex split fails (can happen if there's unclosed quotes)
        search_words = search_string.split(' ')
    
    conn = sqlite3.connect(database_location) # Connect to datbase
            
    # Generate query based on search criteria
    query = f"SELECT name, path FROM ask_eva WHERE name LIKE '%{search_words[0]}%'"
    if len(search_words)>1:
        for search_word in search_words[1:]:
            query += f" AND name LIKE '%{search_word}%'"

    query += ";"
    
    # put results into a pandas dataframe
    c = conn.cursor()
    c.execute(query)
    a = c.fetchall()
    results = pd.DataFrame(a, columns=['name','path'])
    conn.close()
    return results          

def get_times(database_location):
    modified = os.path.getmtime(database_location)
    year,month,day,hour,minute,second = time.localtime(modified)[:-3]
    modtime =  ("%02d/%02d/%d %02d:%02d:%02d"%(day,month,year,hour,minute,second))

    conn = sqlite3.connect(database_location)
    update_time = pd.read_sql_query('SELECT * FROM update_time', conn).loc[0,'update_time']
    conn.close()

    return (modtime, update_time)
