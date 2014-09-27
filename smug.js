// Minify and run tiny code


// [ Requires ]
// [ -Node- ]
var zlib = require('zlib');
var fs = require('fs');
// [ -Third-Party- ]
var uglify = require('uglify-js');


// [ Smugify ]
function smugify(file_names, out_file_name, smugify_callback) {
    var minified = uglify.minify(file_names);
    zlib.gzip(minified.code, function(error, gzipped) {
        if (error) {
            smugify_callback(error);
            return null;
        } else {
            var printable = gzipped.toString('base64');
            var code = '' +
            'var zlib = require("zlib");' +
            'zlib.gunzip(new Buffer("' + printable + '", "base64"), function(error, gunzipped) {' +
            '    if (error) { throw error; }' +
            '    var evaluable = gunzipped.toString();' +
            '    eval(evaluable);' +
            '});';
            var reminified = uglify.minify(code, {'fromString': true});
            fs.writeFile(out_file_name, reminified.code, smugify_callback);
            return null;
        }
    });
    return null;
}


exports.smugify = smugify;
