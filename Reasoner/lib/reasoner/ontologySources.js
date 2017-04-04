var async = require('async'),
    fs = require('fs'),
    _ = require('underscore'),
    SemanticRule = require('./SemanticRule');

function ontologySources(nodes, done) {
  var ontologyNodes = nodes.ontologyNodes();
  var definitions = ontologyNodes.map(function (node) { return node.ontology(); });

  if (nodes.reasoner) {
    definitions.push(nodes.reasoner.ontologyDefinitions);
  }

  var files = [
    'world.n3',
    'arrangements.n3',
    'properties.n3',
    'applications.n3'
  ];

  files.forEach(function (fileName) {
    definitions.push({
      toN3: function (callback) {
        var path = __dirname + '/../ontologies/' + fileName;

        fs.exists(path, function (exists) {
          if (exists) {
            fs.readFile(path, 'utf8', callback);
          } else {
            callback('Not found');
          }
        });
      }
    });
  });

  async.map(definitions, function (definition, callback) {
    if (typeof definition == 'string') {
      callback(null, definition);
    } else if (definition.toN3) {
      definition.toN3(callback);
    } else {
      var rule = new SemanticRule();
      rule.postcondition = definition;
      rule.toN3(callback);
    }
  }, function (err, sources) {
    if (!err) {
      sources = _.uniq(sources);
    }
    done(err, sources);
  });
}

module.exports = ontologySources;
