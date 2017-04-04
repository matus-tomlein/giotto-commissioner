var blankArrangementNode = require('./blankArrangementNode'),
    CaseReasoner = require('../index'),
    vocab = CaseReasoner.vocabulary;

function Placement(id, nodes) {
  this.nodes = nodes;
  this.ofResource = null;
  this.ofDevice = null;
  this.inFlow = null;
  this.inLocation = null;
  this.id = id;
  this.variableName = '?placement_' + id;
}

Placement.prototype.precondition = function () {
  var items = [
    [this.variableName, vocab.rdf('type'), vocab.case('Placement')]
  ];

  var arrangement = blankArrangementNode({
    device: this.ofDevice,
    resource: this.ofResource
  });

  if (arrangement) {
    items.push([this.variableName, vocab.case('of'), arrangement]);
  }

  if (this.inLocation) {
    items.push([this.variableName, vocab.case('in'), this.inLocation.variableName]);
  } else if (this.inFlow) {
    items.push([this.inFlow.variableName, vocab.case('flowLocation'), '?flowLocation_' + this.id]);
    items.push([this.variableName, vocab.case('in'), '?flowLocation_' + this.id]);
  }

  return items;
};

module.exports = Placement;
