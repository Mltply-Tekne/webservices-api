// Web
global.express = require("express")
require('express-async-errors');
global.app = express()
global.router = express.Router()





// Global Variables
global.errorHandler = require('./helpers/errorHandler.js')
// global.requestValidation = require(`${process.env.srcPath}/validations/requestValidation`)
// global.responseValidation = require(`${process.env.srcPath}/validations/responseValidation`)

// Global Functions
jsonHelpers = require('./helpers/jsonHelpers.js')
global.arrayToKey = jsonHelpers.arrayToKey
global.groupJson = jsonHelpers.groupJson

global.arrayUtilities = require('./helpers/arrayUtilities.js')

// Logging
console.log = require('./helpers/logs.js').consoleLog

// Web server
require('./config/network.js')(app, express);


// Routes
app.use('/cancellations/', require('./routes/cancellationsRoutes'))
app.use('/agency/verification/', require('./routes/agencyVerificationRoutes'))
app.use('/resources/', require('./routes/resourcesRoutes'))
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);


app.get('/test/', function (request, response) {
  response.sendFile(`${process.env.srcPath}/views/test.html`)
})


// Close Connections before Exit
function exitHandler(options, exitCode) {
  if (exitCode || exitCode === 0) console.log(exitCode);

  if (options.exit) process.exit();
}

// log errors to console, and continue server
process.on('uncaughtException', function (err) {
  console.log(`Error: ${err.stack}`);
});

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));


// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});