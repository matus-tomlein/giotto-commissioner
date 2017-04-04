var CaseReasoner = require('../index'),
    _ = require('underscore'),
    vocab = CaseReasoner.vocabulary;

function Location(id) {
  this.id = id;
  this.locationType = null;
  this.variableName = '?location_' + this.id;
}

Location.prototype.precondition = function (ancestors) {
  var that = this;

  if (this.locationType) {
    var items = [
      [ this.variableName, vocab.rdf('type'), vocab.case('Location') ],
      [ this.variableName, vocab.case('locationType'), this.locationType.uri ]
    ];
    var locationAncestors = _.select(ancestors, function (ancestor) {
      return ancestor.constructor.name == 'LocationNode' &&
        ancestor.variableName != this.variableName;
    });

    locationAncestors.forEach(function (ancestor) {
      items.push([
        that.variableName,
        vocab.log('notEqualTo'),
        ancestor.variableName
      ]);
    });

    return items;
  }
  return [];
};

module.exports = Location;
