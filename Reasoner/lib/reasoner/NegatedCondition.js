var Graph = require('./Graph'),
    vocab = require('./vocabulary'),
    N3 = require('n3');

function NegatedCondition(variables, conditionItems) {
  this.variables = variables;
  this.conditionItems = conditionItems;
}

NegatedCondition.prototype.toN3 = function (callback) {
  var worldVariable = '?wrld_' + Math.random().toString(36).substring(7);

  var query = [];
  query = query.concat(this.conditionItems);

  this.variables.forEach(function (variable) {
    query.push([ worldVariable, vocab.case('contains'), variable ]);
  });

  var graph = new Graph(query);

  graph.toN3(function (err, graphN3) {
    if (err) {
      callback(err);
    } else {
      var blank = '[ <' +
        vocab.euler('findall') + '> (\n' + worldVariable + '\n' + graphN3 +
            '()\n)\n].\n';
      callback(null, blank);
    }
  });
};

module.exports = NegatedCondition;
