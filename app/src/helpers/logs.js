// Files
const fs = require('fs');
var util = require('util');

// Logs File
var log_file = fs.createWriteStream('/home/app/log.txt', {flags : 'w'});
var log_stdout = process.stdout;

consoleLog = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

module.exports = {consoleLog}