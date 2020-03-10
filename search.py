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
    SearchWords = SearchString.split()

    data['Index'] = data_lower.str.find(SearchWords[0].lower())
    results = data[data["Index"] != -1] # Storing results as a dataframe
    results = results.drop(columns="Index")
    try:
        for i in range(1,len(SearchWords)):
            results_lower = results['name'].str.lower() 
            results['Index'] = results_lower.str.find(SearchWords[i].lower())
            results = results[results["Index"] != -1]
            results = results.drop(columns="Index")
            
    except:
        pass
    
    hits = len(results)

    if results.empty:
        results = "No files found!"
        return results, hits
    else:
        pd.set_option('display.max_rows', None)
        return results[['name','path']], hits
            

def getmodtime():
    modified = os.path.getmtime(database_location)
    year,month,day,hour,minute,second = time.localtime(modified)[:-3]
    modtime =  ("%02d/%02d/%d %02d:%02d:%02d"%(day,month,year,hour,minute,second))
    return modtime
