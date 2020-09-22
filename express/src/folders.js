const fs = require('fs');
const LineReaderSync = require("line-reader-sync")

module.exports.get_folders = function get_folders(folder_location) {
    // array of folders to index
    const folders = new LineReaderSync(folder_location).toLines()
    return folders
}

module.exports.set_folders = function set_folders(folder_location, lines) {
    fs.writeFile(folder_location, lines, 'ascii', () => {});
}