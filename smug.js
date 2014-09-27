// Minify and run tiny code


// [ Requires ]
// [ -Node- ]
var zlib = require('zlib');
var fs = require('fs');
// [ -Third-Party- ]
var uglify = require('uglify-js');


// [ Smugify ]
function smugify(file_names, smugify_callback) {
    var minified = uglify.minify(file_names);
    zlib.gzip(minified.code, function(error, gzipped) {
        if (error) {
            smugify_callback(error);
            return null;
        } else {
            var printable = gzipped.toString('base64');
            var code = '' +
            'var zlib = require("zlib");' +
            'exports.load = function(callback) {' +
            '    zlib.gunzip(new Buffer("' + printable + '", "base64"), function(error, gunzipped) {' +
            '        if (error) { callback(error); return null; }' +
            '        eval(gunzipped.toString());' +
            '        callback(null);' +
            '    });' +
            '};';
            var reminified = uglify.minify(code, {'fromString': true});
            smugify_callback(null, reminified.code);
            return null;
        }
    });
    return null;
}


exports.smugify = smugify;
