var blankArrangementNode = require('./blankArrangementNode'),
    CaseReasoner = require('../index'),
    N3 = require('n3'),
    N3Util = N3.Util,
    vocab = CaseReasoner.vocabulary;

function Flow(id) {
  this.fromDevice = null;
  this.fromResource = null;
  this.fromFlowLocation = null;
  this.fromJoin = null;
  this.fromExternal = null;
  this.toDevice = null;
  this.toResource = null;
  this.toFlowLocation = null;
  this.toJoin = null;
  this.toExternal = null;
  this.type = null;
  this.id = id;
  this.variableName = '?flow_' + id;
  this.placements = [];
}

Flow.prototype.addPlacement = function (placement) {
  this.placements.push(placement);
};

Flow.prototype.precondition = function () {
  if (!this.type) {
    console.error('Failed to find flow type');
    return [];
  }

  var blankFrom = this.blankFromNode();
  var blankTo = this.blankToNode();

  var items = [
    [this.variableName, vocab.rdf('type'), vocab.case('Arrangement')],
    [this.variableName, vocab.case('kind'), N3Util.createLiteral('flow')],
    [this.variableName, vocab.case('arrangementType'), this.type.uri]
  ];

  if (blankFrom)
    items.push([this.variableName, vocab.case('from'), blankFrom]);
  if (blankTo)
    items.push([this.variableName, vocab.case('to'), blankTo]);

  return items;
};

Flow.prototype.blankFromNode = function () {
  if (this.fromFlowLocation)
    return this.fromFlowLocation.blankNode();

  return blankArrangementNode({
    device: this.fromDevice,
    resource: this.fromResource,
    external: this.fromExternal,
    join: this.fromJoin
  });
};

Flow.prototype.blankToNode = function () {
  if (this.toFlowLocation)
    return this.toFlowLocation.blankNode();

  return blankArrangementNode({
    device: this.toDevice,
    resource: this.toResource,
    external: this.toExternal,
    join: this.toJoin
  });
};

module.exports = Flow;
