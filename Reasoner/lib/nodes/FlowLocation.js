var CaseReasoner = require('../index'),
    N3 = require('n3'),
    vocab = CaseReasoner.vocabulary;

function FlowLocation() {
  this.devices = [];
  this.resources = [];
}

FlowLocation.prototype.blankNode = function () {
  var writer = N3.Writer();
  var blankItems = [{
    predicate: vocab.rdf('type'),
    object: vocab.case('Location')
  }];

  this.devices.concat(this.resources).forEach(function (target) {
    blankItems.push({
      predicate: vocab.case('placement'),
      object: writer.blank([
        {
          predicate: vocab.case('of'),
          object: writer.blank([
            {
              predicate: vocab.case('target'),
              object: target.variableName
            }
          ])
        }
      ])
    });
  });

  return writer.blank([{
    predicate: vocab.case('location'),
    object: writer.blank(blankItems)
  }]);
};

module.exports = FlowLocation;
