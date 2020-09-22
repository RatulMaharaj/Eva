const sqlite3 = require('sqlite3').verbose();
var index_folder = require('./index_folder.js')


module.exports.update = function update(database_location, folders) {
    // data we want to store
    const data = index_folder.get_stats(folders)

    // connect to the database
    let db = new sqlite3.Database(database_location, sqlite3.OPEN_READWRITE)
    db.serialize(() => {

        db.run(`DROP TABLE IF EXISTS ask_eva`);

        db.run(`CREATE TABLE IF NOT EXISTS ask_eva(id integer, 
            name text, 
            path text,
            is_folder text,
            size_bytes numeric,
            accessed_time text,
            modified_time text,
            created_time text)`)

        for (const i in data.id) {
            var row = [
                data.id[i],
                data.name[i],
                data.path[i],
                data.is_folder[i],
                data.size_bytes[i],
                data.accessed_time[i],
                data.modified_time[i],
                data.created_time[i]
            ]
            let sql = `INSERT INTO ask_eva (
                    id, 
                    name,
                    path, 
                    is_folder, 
                    size_bytes, 
                    accessed_time, 
                    modified_time, 
                    created_time) 
                    VALUES ((?), (?), (?), (?), (?), (?), (?), (?)) `;
            db.run(sql, row, function (err) {
                if (err) {
                    return console.log(err.message);
                }
            })

        }
    })
}
