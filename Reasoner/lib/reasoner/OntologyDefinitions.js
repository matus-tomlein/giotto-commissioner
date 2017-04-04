var _ = require('underscore'),
    SemanticRule = require('./SemanticRule');

function OntologyDefinitions() {
  this.facts = [];
}

OntologyDefinitions.prototype.addFacts = function (facts) {
  this.facts = _.union(this.facts, facts);
};

OntologyDefinitions.prototype.toN3 = function (callback) {
  var rule = new SemanticRule();
  rule.postcondition = this.facts;
  rule.toN3(callback);
};

module.exports = OntologyDefinitions;
