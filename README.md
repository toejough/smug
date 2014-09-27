smug
====

Really really minified js via uglify, gzip, base64, and EVAL.  

why?
====

To scratch an itch.  Minifying code is common, but how small can you really get it?  Well, you could minifiy it, then zip it up...but then it's not actually usable till you unzip it.  Well, if you're using node, zlib is already installed, so you could actually programmatically unzip and eval it.  If you save it in base64 it's still text, so the intermediate zipped version won't give you any trouble when you try to print it or load it into an editor.  Hmmm...

why the name?
=============

base(S)ixtyfour (M)inified (U)glify (G)zip.  Smug about being as small as possible.  I like jumbled acronyms that also describe or anthropomorphize the project.  "smug" seems to apply to something as silly as this - "I have smaller code than you do".  Like many smug people, "smug" has a flaw or 4 which it should not be so proud of...

what's the catch?
=================

* node only
* use of zlib means that requiring a smugified module is asynchronous.  You have to use the `.smugly(cb)` init function.  'cb' will be called when the module is _actually_ loaded.
* for small files, minifying the code with `uglify-js` (which smug uses) results in code which is smaller than `smug` produces with its minify-gzip-base64-wrap nonsense.  In this case, we use the minified code raw, but still add the `.smugly` callback, because otherwise you'd have to know whether the code was smuglified or just minified in order to use it correctly.  This means that for small files, `smug` will produce a _larger_ file than `uglify-js`, which is the _opposite_ of the point.  Until there's transparent support in node for modules which load asynchronously, this will be a problem.
* in general, the use of base64 encoding means that the file is larger than it strictly needs to be, but unless you want to split the original file in two (maximally compressed binary + minified shim/loader file), this is the price.

how does it work?
=================

`smug` is actually pretty straightforward - other modules do the heavy lifting.  Here's the basic flow:

1. pass your file names to `uglify-js` for some advanced minification.
2. pass that minified file through node's zlib library to gzip the minified text
3. convert that gzipped data to base64
4. wrap that in code which will reverse the process when `smugly` is called on it
5. re-minify (with `uglify-js` again)
6. return the resulting text

As noted in the prior section, there is a case in which the minified code is as condensed as it will get, because there isn't enough code to compress with gzip - the gains are overwhelmed by the cost of base64 conversion and adding the extraction wrapper code.  `smug` catches that condition, tosses in a `smugly` function for compatiblility/uniformity, reminifies, and then returns that (non-gzipped) text instead.

example usage please
====================

cli:
```bash
npm install -g smug
smugify wisper.js > wisper.smug.js

# wisper.js -> 19k
# wisper.min.js (with uglify-js) -> 9.5k
# wisper.smug.js -> 2.9k
```

node:
```javascript
#! /usr/bin/env node

var smug = require('./smug.js');

var files = process.argv.slice(2);

smug.smugify(files, function(error, result) {
    if (error) {
        console.error(error);
    } else {
        console.log(result);
    }
});
```

