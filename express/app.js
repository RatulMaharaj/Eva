var search = require('./src/search.js')

const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello from node!')
})

app.get('/api/search', (req, res) => {

  let searchcriteria = req.query.q;

  search.search_db(searchcriteria, '../dependencies/database.db')
    .then((data) => {
      if (data.length === 0) {
        res.send({
          'hits': data.length,
          'results': [{
            'name': 'No files were found!',
            'path': 'Please adjust your search criteria and try again.'
          }],
          'returned_hits': data.length,
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


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})