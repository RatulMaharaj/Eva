var search = require('./src/search.js')
var folders = require('./src/folders.js')
var update = require('./src/update.js')
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const ipfilter = require('express-ipfilter').IpFilter
// const IpDeniedError = require('express-ipfilter').IpDeniedError

const app = express()

// Whitelist the following IPs
const ips = ['::ffff:127.0.0.1']

app.use(ipfilter(ips, { mode: 'allow' }))
app.use(express.static(path.join(__dirname, '../build')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 80

const version = '0.4.0'


if (process.platform === 'darwin') {
  var DEP_FOLDER = '../dependencies/'  // unix
} else {
  DEP_FOLDER = '..\\dependencies\\'  // Windows
}

const DATABASE_LOCATION = DEP_FOLDER + "database.db"
const FOLDERS_LOCATION = DEP_FOLDER + "folders.txt"
fs.openSync(DATABASE_LOCATION, 'a')
fs.openSync(FOLDERS_LOCATION, 'a')

// const DEFAULT_SEARCH_RESULT_LIMIT = 100
var IS_UPDATING = "no"

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
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
    'modtime': 'FEATURE NOT AVAILABLE YET',
    'updatetime': 'FEATURE NOT AVAILABLE YET',
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
    'modtime': 'FEATURE NOT AVAILABLE YET',
    'updatetime': 'FEATURE NOT AVAILABLE YET',
    'version': version,
    'folders': folders_str,
    'isUpdating': IS_UPDATING,
  })
})

app.listen(port, () => {
  console.log(`Eva Express server listening at http://0.0.0.0:${port}`)
})