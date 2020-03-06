# Importing the required libraries
import numpy as np
import pandas as pd
import os
import time
from update import database_location


# Import Database
fields = ['name','path'] # The fields we want from the datafile
data = pd.read_csv(database_location, usecols = fields, low_memory = False) # Read the data into a pandas dataframe

# Search function
def searchcsv(SearchString):
    '''
    This function can be used to search for files saved in the OMART folders.
    '''
    data_lower = data['name'].str.lower() 
    
    data['Index'] = data_lower.str.find(SearchString.lower())  # creating and passsing search results to new column 
    results = data[data["Index"] != -1] # Storing results as a dataframe

    if results.empty:
        results = "No files found!"
        return results
    else:
        pd.set_option('display.max_rows', None)
        return results[['name','path']]
        

def getmodtime():
    modified = os.path.getmtime(database_location)
    year,month,day,hour,minute,second = time.localtime(modified)[:-3]
    modtime =  ("%02d/%02d/%d %02d:%02d:%02d"%(day,month,year,hour,minute,second))
    return modtime
