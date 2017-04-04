var CaseReasoner = require('../index'),
    N3 = require('n3'),
    hashString = require('./hashString'),
    N3Util = N3.Util,
    vocab = CaseReasoner.vocabulary;

function Device(label) {
  this.variableName = '?device_' + hashString(label);
  this.parentNode = null;

  this.characteristics = [];
}

Device.forVariable = function (variable) {
  if (variable)
    return new Device(variable);
  return null;
};

Device.prototype.precondition = function (ancestors) {
  var that = this;
  var items = [
    [this.variableName, vocab.rdf('type'), vocab.case('Device')]
  ];

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

  var deviceAncestors = [];
  ancestors.forEach(function (ancestor) {
    if (ancestor.variables && ancestor.variables.Device) {
      for (var variableName in ancestor.variables.Device) {
        if (variableName != this.variableName) {
          deviceAncestors.push(ancestor.variables.Device[variableName]);
        }
      }
    }
  });

  if (this.parentNode &&
      this.parentNode.variables &&
      this.parentNode.variables.Device) {
    var devices = this.parentNode.variables.Device;

    for (var deviceVariable in devices) {
      var device = devices[deviceVariable];

      if (device.variableName != that.variableName) {
        items.push([
          that.variableName,
          vocab.log('notEqualTo'),
          device.variableName
        ]);
      }
    }
  }

  deviceAncestors.forEach(function (ancestor) {
    items.push([
      this.variableName,
      vocab.log('notEqualTo'),
      ancestor.variableName
    ]);
  });

  return items;
};

module.exports = Device;
