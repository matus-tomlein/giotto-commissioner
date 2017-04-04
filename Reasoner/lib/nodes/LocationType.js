var CaseReasoner = require('../index'),
    N3 = require('n3'),
    N3Util = N3.Util,
    vocab = CaseReasoner.vocabulary;

var LocationType = function (nodeId) {
  this.nodeId = nodeId;
  this.uri = vocab.case('location_type_' + this.nodeId);
  this.name = '';
  this.description = '';
};

LocationType.prototype.ontology = function () {
  var items = [
    [ this.uri, vocab.rdf('type'), vocab.case('LocationType') ],
    [ this.uri, vocab.case('name'), N3Util.createLiteral(this.name) ],
    [ this.uri, vocab.case('description'), N3Util.createLiteral(this.description) ]
  ];

  return items;
};

module.exports = LocationType;
