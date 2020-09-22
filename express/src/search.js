const sqlite3 = require('sqlite3').verbose();

module.exports.search_db = async function search_db(search_string, database_location) {

    // Construct the search query
    const search_words = search_string.split(' ')

    let query = `SELECT name, path FROM ask_eva WHERE name LIKE '%${search_words[0]}%'`
    if (search_words.length > 1) {
        for (let i = 1; i < search_words.length; i++) {
            query += ` AND name LIKE '%${search_words[i]}%'`
        }
    }
    query += `;`

    // connect to the database
    let db = new sqlite3.Database(database_location, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    var data = [];
    var records = [];

    function getRecords() {
        return new Promise(resolve => {
            db.all(query, [], (err, rows) => {
                if (err) {
                    return console.error(err.message);
                }
                rows.forEach((row) => {
                    data.push({ 'name': row.name, 'path': row.path });
                });

                resolve(data);
            });
        });
    }

    records = await getRecords();
    // Close the connection
    db.close()

    return records
}
