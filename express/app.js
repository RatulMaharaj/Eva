var search = require('./src/search.js')
var folders = require('./src/folders.js')
var update = require('./src/update.js')
const express = require('express')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 5000

const version = '0.4.0'


if (process.platform === 'darwin') {
  var DEP_FOLDER = '../dependencies/'  // unix
} else {
  DEP_FOLDER = '..\\dependencies\\'  // Windows
}

const DATABASE_LOCATION = DEP_FOLDER + "database.db"
const FOLDERS_LOCATION = DEP_FOLDER + "folders.txt"
// const DEFAULT_SEARCH_RESULT_LIMIT = 100
var IS_UPDATING = "no"

app.get('/', (req, res) => {
  res.send('Hello from node!')
})


app.get('/api/search', (req, res) => {
  let searchcriteria = req.query.q;

  search.search_db(searchcriteria, '../dependencies/database.db')
    .then((data) => {
      if (data.length === 0 || searchcriteria === '') {
        res.send({
          'hits': 0,
          'results': [{
            'name': 'No files were found!',
            'path': 'Please adjust your search criteria and try again.'
          }],
          'returned_hits': 0,
          'searchcriteria': searchcriteria
        })
      }
      else {
        res.send({
          'hits': data.length,
          'results': data,
          'returned_hits': data.length,
          'searchcriteria': searchcriteria
        })
      }
    })
})


app.get('/api/settings', (req, res) => {

  const folders_str = folders.get_folders(FOLDERS_LOCATION).join('\n')

  res.send({
    'modtime': 'NOT READY YET',
    'updatetime': 'NOT READY YET',
    'version': version,
    'folders': folders_str,
    'isUpdating': IS_UPDATING,
  })
})


app.post('/api/settings', (req, res) => {
  console.log('POST received! Commencing the data crunching!')

  folders.set_folders(FOLDERS_LOCATION, req.body.folders)
  update.update(DATABASE_LOCATION, req.body.folders.split('\n'))

  const folders_str = folders.get_folders(FOLDERS_LOCATION).join('\n')
  
  console.log('Update Complete!')

  res.send({
    'modtime': 'NOT READY YET',
    'updatetime': 'NOT READY YET',
    'version': version,
    'folders': folders_str,
    'isUpdating': IS_UPDATING,
  })
})


app.listen(port, () => {
  console.log(`Eva Express server listening at http://localhost:${port}`)
})