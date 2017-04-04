var CaseReasoner = require('../index'),
    N3 = require('n3'),
    hashString = require('./hashString'),
    N3Util = N3.Util,
    vocab = CaseReasoner.vocabulary;

function Service(label) {
  this.variableName = '?service_' + hashString(label);
  this.serviceType = 'provider';
  this.device = null;
  this.parentNode = null;

  this.characteristics = [];
}

Service.prototype.precondition = function () {
  var that = this;
  var items = [
    [this.variableName, vocab.rdf('type'), vocab.case('Service')],
    [this.variableName, vocab.case('serviceType'), N3Util.createLiteral(this.serviceType)]
  ];

  if (this.device)
    items.push([
      this.variableName, vocab.case('device'), this.device.variableName
    ]);

  var writer = N3.Writer();
  this.characteristics.forEach(function (characteristic) {
    var blankItems = [ {
      predicate: vocab.case('characteristicType'),
      object: characteristic.uri
    } ];

    if (characteristic.value) {
      blankItems.push({
        predicate: vocab.case('value'),
        object: N3Util.createLiteral(characteristic.value)
      });
    }

    items.push([that.variableName, vocab.case('characteristic'), writer.blank(blankItems)]);
  });

  return items;
};

module.exports = Service;
