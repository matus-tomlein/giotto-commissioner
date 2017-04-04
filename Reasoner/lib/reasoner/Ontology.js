var N3 = require('n3'),
    _ = require('underscore'),
    RuleSerializer = require('./RuleSerializer'),
    Reasoner = require('./Reasoner');

var Ontology = function Ontology(nodes) {
  this.nodes = nodes;
  this.sources = [];
};

Ontology.prototype.definitions = function (callback) {
  var writer = N3.Writer({
    prefixes: {
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      'case': 'http://matus.tomlein.org/case#'
    }
  });
  writer.end(callback);
};

Ontology.prototype.addSources = function (sources) {
  this.sources = _.union(sources, this.sources);
};

Ontology.prototype.processDefinitions = function processDefinitions(callback) {
  var that = this;

  that.definitions(function (err, definitionData) {
    if (err) {
      callback(err);
    } else {
      var data = [ definitionData ];
      that.addSources(data);

      reason(that, that.sources, callback);
    }
  });
};

Ontology.prototype.process = function process(callback) {
  var that = this;

  console.time('compiling-rules');
  that.serializeFlows(function (err, flowsData) {
    console.timeEnd('compiling-rules');

    if (err) {
      callback(err, null);
    } else {
      that.definitions(function (err, definitionData) {
        if (err) {
          callback(err);
        } else {
          var data = [
            definitionData,
            flowsData
          ];
          that.addSources(data);

          reason(that, that.sources, callback);
        }
      });
    }
  });
};

Ontology.prototype.parse = function parse(callback) {
  if (this.processed != null) {
    var parser = N3.Parser();
    var store = N3.Store();

    parser.parse(this.processed, function (error, triple) {
      if (error)
        callback(error);
      else if (triple)
        store.addTriple(triple.subject, triple.predicate, triple.object);
      else
        callback(null, store);
    });
  } else {
    callback('Not processed');
  }
};

Ontology.prototype.serializeFlows = function serializeFlows(callback) {
  var serializer = new RuleSerializer(this.nodes);
  serializer.serialize(callback);
};

function reason(ontology, data, callback) {
  var reasoner = new Reasoner();
  reasoner.reason(data,
      function (err, output) {
        if (err == null) {
          ontology.processed = output;
        }
        callback(err, output);
      });
}

module.exports = Ontology;
