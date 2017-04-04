var app = require('./app'),
    http = require('http'),
    initializeNodered = require('./initializeNodered'),
    instance = require('./instance'),
    SemanticRule = require('./reasoner/SemanticRule'),
    NegatedCondition = require('./reasoner/NegatedCondition'),
    OntologyDefinitions = require('./reasoner/OntologyDefinitions'),
    vocabulary = require('./reasoner/vocabulary');

function CaseReasoner(settings) {
  console.log(__dirname);

  instance(this);

  // Create a server
  var server = http.createServer(app);

  var RED = initializeNodered(http,
      server,
      app,
      settings.rules || {});

  // Start the runtime
  RED.start();

  server.listen(settings.port || 8000);
  server.timeout = 1000000;
  require('./api')(app, this);

  this.settings = settings;
  this.app = app;
  this.RED = RED;
  this.ontologyDefinitions = new OntologyDefinitions();
  this.nodes = null;
}

CaseReasoner.instance = function () {
  return instance();
};

CaseReasoner.vocabulary = vocabulary;
CaseReasoner.SemanticRule = SemanticRule;
CaseReasoner.NegatedCondition = NegatedCondition;

CaseReasoner.prototype.setNodes = function (nodes) {
  this.nodes = nodes;
  this.nodes.reasoner = this;
};

CaseReasoner.prototype.getNodes = function () {
  return this.nodes;
};

module.exports = CaseReasoner;
