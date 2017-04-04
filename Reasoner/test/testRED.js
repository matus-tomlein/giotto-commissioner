module.exports = function testRED(flowsFile) {
  var RED = require('node-red');

  // Create the settings object - see default settings.js file for other options
  var settings = {
    verbose: true,
    userDir: __dirname,
    coreNodesDir: __dirname + '../src/red/nodes',
    functionGlobalContext: { },// enables global context
    paletteCategories: ['subflows', 'control', 'layouts', 'devices', 'installation', 'helpers']
  };

  // Initialise the runtime with a server and settings
  RED.init(server, settings);

  // Start the runtime
  RED.start();

  return RED;
};
