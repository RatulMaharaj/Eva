import os 
import hashlib
import numpy as np
import pandas as pd
from datetime import datetime
from src.folderstats import folderstats

database_location = "..\\Eva - Dependencies\\database.csv"
folders_location = "..\\Eva - Dependencies\\folders.csv"

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
    df = df[df['name'] != ""] # remove all files with no names
    df = df.drop(df.columns[[0,4,7,8,9,10,11]],axis=1) # drop columns we aren't using
    df['name'] = df['name'] + '.' + df['extension'] # adding file extensions to the name
    df = df.dropna(axis=0) # remove null rows
    df = df.drop(df.columns[2],axis=1) # drop column we aren't using
    df['id'] = np.arange(len(df)) # We give each file an id

    #  Save the file to the drive
    df.to_csv(database_location)