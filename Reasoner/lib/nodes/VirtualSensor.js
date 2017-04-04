var CaseReasoner = require('../index'),
    Variables = require('./Variables'),
    N3 = require('n3'),
    hashString = require('./hashString'),
    N3Util = N3.Util,
    vocab = CaseReasoner.vocabulary;

function VirtualSensor(label) {
  this.variableName = '?vrtls_' + hashString(label);
  this.name = label;

  this.inputs = [];
  this.labels = [];
}

VirtualSensor.prototype.assigned = function (nodes, ancestors) {
  var writer = N3.Writer();
  var items = this.serialize(nodes, ancestors, null, 'RequiredVirtualSensor');
  var blankItems = items.map(function (triple) {
    return {
      predicate: triple[1],
      object: triple[2]
    };
  });

  return [
    [ vocab.case('Reasoning'), vocab.case('uncovered'), writer.blank(blankItems) ]
  ];
};

VirtualSensor.prototype.precondition = function (nodes, ancestors) {
  return this.serialize(nodes, ancestors, this.variableName, 'VirtualSensor');
};

VirtualSensor.prototype.serialize = function (nodes, ancestors, subject, type) {
  var items = [
    [subject, vocab.rdf('type'), vocab.case(type)],
    [subject, vocab.case('name'), N3Util.createLiteral(this.name)]
  ];

  var vars = new Variables(nodes, ancestors);

  this.inputs.forEach(function (input) {
    var service = vars.getVariable(input, 'DataProvider');
    if (service) {
      items.push([subject, vocab.case('input'), service.variableName]);
    } else {
      console.error('Failed to find referenced service in virtual sensor.');
    }
  });
  this.labels.forEach(function (label) {
    items.push([subject, vocab.case('label'), N3Util.createLiteral(label)]);
  });

  return items;
};

module.exports = VirtualSensor;
