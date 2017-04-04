var hashString = require('./hashString'),
    CaseReasoner = require('../index'),
    vocab = CaseReasoner.vocabulary;

function Join(nodeId, variable) {
  this.variableName = '?join_' + hashString(nodeId + '-' + variable);
}

Join.prototype.precondition = function () {
  return [
    [ this.variableName, vocab.rdf('type'), vocab.case('Join') ]
  ];
};

module.exports = Join;
