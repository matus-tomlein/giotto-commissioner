var CaseReasoner = require('../index'),
    N3 = require('n3'),
    N3Util = N3.Util,
    hashString = require('./hashString'),
    vocab = CaseReasoner.vocabulary;

function ExternalSystem(name) {
  this.name = name;
  this.nodeId = hashString(name);
  this.uri = vocab.case('external_' + this.nodeId);
}

ExternalSystem.prototype.ontology = function () {
  return [
    [ this.uri, vocab.rdf('type'), vocab.case('ExternalSystem') ],
    [ this.uri, vocab.case('name'), N3Util.createLiteral(this.name) ]
  ];
};

module.exports = ExternalSystem;
