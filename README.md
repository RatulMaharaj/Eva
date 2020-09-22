# Eva

#### ABOUT

Eva is a multi-purpose toolkit whose purpose is to assist it's users with their daily tasks.

#### CURRENT APPLICATIONS

Below is a list of the current applications available on Eva: 
* Ask Eva - A shared drive search application.

Eva is continuously being tweaked and improved. More applications will be added in the future.
 
#### INSTALLING EVA

A prior installation of python 3.7 or above is required. You will then need to follow the following process:

Open a new terminal and cd into the directory where you will be installing Eva.

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

```
# Starting the development version of the app

You need two terminal windows to run the development version of the app, one for the backend flask server and another for the react front end. 

## Backend

```shell
npm run start-api
```

## Frontend
In a new terminal window:

```shell
npm start
```

Navigate to localhost:3000 in your browser.

#### CREATED BY
 
Ratul Maharaj & Simey de Klerk 
 
20 February 2020
