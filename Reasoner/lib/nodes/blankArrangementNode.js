var N3 = require('n3'),
    CaseReasoner = require('../index'),
    vocab = CaseReasoner.vocabulary;

function blankArrangementNode(target) {
  if (!target.device &&
      !target.resource &&
      !target.external &&
      !target.join) return null;

  var writer = N3.Writer();
  var statements = [
      {
        predicate: vocab.rdf('type'),
        object: vocab.case('ArrangementNode')
      }
  ];

  if (target.device) {
    statements.push({
      predicate: vocab.case('device'),
      object: target.device.variableName
    });
  }
  else if (target.resource) {
    statements.push({
      predicate: vocab.case('resource'),
      object: target.resource.variableName
    });
  } else if (target.external) {
    statements.push({
      predicate: vocab.case('externalSystem'),
      object: target.external.uri
    });
  } else if (target.join) {
    statements.push({
      predicate: vocab.case('join'),
      object: target.join.variableName
    });
  } else {
    console.log('Couldn\'t find referenced device or resource');
  }

  return writer.blank(statements);
}

module.exports = blankArrangementNode;
