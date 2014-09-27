var smug = require('./smug');

var files = process.argv.slice(2);

smug.smugify(files, function(error, result) {
    if (error) {
        console.error(error);
    } else {
        console.log(result);
    }
});
