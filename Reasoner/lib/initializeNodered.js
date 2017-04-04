var RED = require('case-node-red');

module.exports = function initializeNodered(http,
    server,
    app,
    settings) {

  // Create the settings object - see default settings.js file for other options
  settings.httpAdminRoot =
    settings.httpAdminRoot || '/rules';
  settings.httpNodeRoot =
    settings.httpNodeRoot || '/api/rules';
  settings.verbose =
    settings.verbose || true;
  settings.userDir =
    settings.userDir || '.';
  settings.flowFile =
    settings.flowFile || 'flows_rules.json';
  settings.coreNodesDir =
    settings.coreNodesDir || __dirname + '/nodes';
  settings.functionGlobalContext =
    settings.functionGlobalContext || { }; // enables global context
  settings.paletteCategories =
    settings.paletteCategories || ['subflows', 'control', 'filters', 'properties', 'functions', 'definitions', 'helpers'];
  settings.editorTheme =
    settings.editorTheme || {
      page: {
        title: 'IoT Commissioner – Applications'
      },
      header: {
        title: 'IoT Commissioner – Applications'
      }
    };

  // Initialise the runtime with a server and settings
  RED.init(server, settings);

  // Serve the editor UI from /red
  app.use(settings.httpAdminRoot,RED.httpAdmin);

  // Serve the http nodes UI from /api
  app.use(settings.httpNodeRoot,RED.httpNode);

  return RED;
};
