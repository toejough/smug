var smug = require('./smug.js');
var util = require('util');

smug.smugify('./hello_world.js', './hello_smug.js', function(error, result) {
    if (error) {
        console.error(error);
        process.exit(1);
    } else {
        var hello = require('./hello_smug.js');
        console.log(util.inspect(hello));
        hello.hello();
        return null;
    }
    return null;
});
