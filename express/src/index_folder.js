const { fdir } = require("fdir");
const fs = require('fs');
const path = require("path");

module.exports.get_stats = function get_stats(folders) {
    var paths = []
    folders.forEach(folder => {
        // get file paths
        const results_path = new fdir()
            .withFullPaths()
            .crawl(folder)
            .sync() // get files synchronously
        paths = paths.concat(results_path)
    });

    // get file names
    var id = []
    var names = []
    var is_folder = []
    var size_bytes = []
    var accessed_time = []
    var modified_time = []
    var created_time = []

    paths.forEach(item => {
        id.push(paths.indexOf(item))
        names.push(path.basename(item))
        try {
            const stats = fs.statSync(item)
            is_folder.push(stats.isDirectory())
            size_bytes.push(stats.size)
            accessed_time.push(stats.atime)
            modified_time.push(stats.mtime)
            created_time.push(stats.ctime)
        } catch (err) {
            console.error(err)
        }
    });

    return ({
        'id': id,
        'name': names,
        'path': paths,
        'is_folder': is_folder,
        'size_bytes': size_bytes,
        'accessed_time': accessed_time,
        'modified_time': modified_time,
        'created_time': created_time
    })
}