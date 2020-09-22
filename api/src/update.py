import pandas as pd
import sqlite3
import datetime as datetime
from .index_folder import index_folder


def read_folders(folders_location):
    with open(folders_location, "r") as f:
        text = f.read()
    folders = text.split("\n")
    return folders


def write_folders(folders, folders_location):
    text = "\n".join(folders)
    with open(folders_location, "w") as f:
        f.write(text)


def update(database_location, folders_location):
    # These are the folders we crawl through to collect information
    start_time = datetime.now()  # start timestamp
    conn = sqlite3.connect(database_location)  # connect to database

    source_folders = read_folders(folders_location)
    frames = [pd.DataFrame(index_folder(f),) for f in source_folders]

    df = pd.concat(frames)
    df.fillna(0)
    df.to_sql("ask_eva", conn, if_exists="replace")  # write data to database table

    end_time = datetime.now()  # end timestamp
    update_time = str(end_time - start_time)

    td = pd.DataFrame({"update_time": [update_time]}, columns=["update_time"])
    td.to_sql("update_time", conn, if_exists="replace")  # write data to database

    conn.close()  # close the connection
