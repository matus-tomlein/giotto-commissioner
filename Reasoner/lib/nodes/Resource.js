var CaseReasoner = require('../index'),
    hashString = require('./hashString'),
    N3 = require('n3'),
    N3Util = N3.Util,
    vocab = CaseReasoner.vocabulary;

function Resource(label) {
  this.label = label;
  this.id = hashString(label);
  this.variableName = '?resource_' + this.id;
  this.potentialUri = vocab.case('potential_resource_' + this.id);
}

Resource.prototype.ontology = function () {
  return [
    [this.potentialUri, vocab.rdf('type'), vocab.case('PotentialResource')],
    [this.potentialUri, vocab.case('name'), N3Util.createLiteral(this.label)]
  ];
};

Resource.prototype.precondition = function () {
  return [
    [this.variableName, vocab.rdf('type'), vocab.case('Resource')],
    [this.variableName, vocab.case('name'), N3Util.createLiteral(this.label)]
  ];
};

module.exports = Resource;
