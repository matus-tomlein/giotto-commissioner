var CaseReasoner = require('../index'),
    N3 = require('n3'),
    N3Util = N3.Util,
    vocab = CaseReasoner.vocabulary;

var FlowType = function (nodeId) {
  this.nodeId = nodeId;
  this.uri = vocab.case('arrangement_type_' + this.nodeId);
  this.name = '';
  this.description = '';
};

FlowType.prototype.ontology = function () {
  var items = [
    [ this.uri, vocab.rdf('type'), vocab.case('ArrangementType') ],
    [ this.uri, vocab.case('label'), N3Util.createLiteral(this.name) ],
    [ this.uri, vocab.case('description'), N3Util.createLiteral(this.description) ],
    [ this.uri, vocab.case('kind'), N3Util.createLiteral('flow') ]
  ];

  return items;
};

module.exports = FlowType;
