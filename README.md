# Eva

#### ABOUT

Eva is a multi-purpose toolkit whose purpose is to assist it's users with their daily tasks.

#### CURRENT APPLICATIONS

Below is a list of the current applications available on Eva: 
* Ask Eva - A shared drive search application.
* Eva PDF - An application that can be used to merge and/or encrypt pdf files.
 
Eva is continuously being tweaked and improved. More applications will be added in the future.
 
#### INSTALLING EVA

A prior installation of python 3.7 or above is required. You will then need to follow the following process:

Open a new cmd terminal and cd into the directory where you will be installing Eva.
 


```shell
# Clone the branch of this repository.
git clone -b Eva-react https://github.com/RatulMaharaj/Eva.git

# Go into the cloned folder.
cd Eva-react

# Install node dependencies
npm install

# Go into api folder
cd api

# Create new virtual environment in the api folder.
python -m venv venv

# Activate the virtual environment.
venv\scripts\activate.bat # windows (cmd)
source ./venv/bin/activate # mac or linux

# Install the required packages.
pip install -r requirements.txt 

# Run the app.
python app.py
```
Navigate to localhost:5000 when you see that the server is runnning. The flask development server is used by default, but this can be changed in the app.py file to use waitress as a production server. 

#### CREATED BY
 
Ratul Maharaj & Simey de Klerk 
 
20 February 2020
