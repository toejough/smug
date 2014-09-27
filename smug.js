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
            var eval_code = '' +
            'var zlib = require("zlib");' +
            'exports.smugly = function(callback) {' +
            '    zlib.gunzip(new Buffer("' + printable + '", "base64"), function(error, gunzipped) {' +
            '        if (error) { callback(error); return null; }' +
            '        eval(gunzipped.toString());' +
            '        callback(null);' +
            '    });' +
            '};';
            var smuglified = uglify.minify(eval_code, {'fromString': true});
            // which is smaller?
            var smallest = smuglified.code;
            var smug_minified = 'exports.smugly = function(c) {c();};' + minified.code;
            var reminified = uglify.minify(smug_minified, {'fromString': true}).code;
            if (reminified.length <= smallest.length) {
                smallest = reminified;
            }
            smugify_callback(null, smallest);
            return null;
        }
    });
    return null;
}


exports.smugify = smugify;
