var smug = require('./smug.js');
var util = require('util');
var fs = require('fs');

smug.smugify('./hello_world.js', function(error, result) {
    if (error) {
        console.error(error);
        process.exit(1);
    } else {
        fs.writeFileSync('./hello_smug.js', result);
        var hello = require('./hello_smug.js');
        hello.smugly(function(error) {
            if (error) {
                console.error(error);
            } else {
                hello.hello();
            }
        });
    }
    return null;
});
