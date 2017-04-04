var api = require('./externalApi');

function findVariables(type) {
  var RED = api.RED;
  if (!RED) return [];

  var nodeTypes = [].concat(type);
  var allVariables = [];

  for (var i in nodeTypes) {
    var nodeType = nodeTypes[i];

    allVariables = allVariables.concat(RED.nodes.filterNodes({})
      .filter(function (node) { return node.variable && node.type == nodeType; })
      .map(function (node) { return node.variable; }));

    RED.nodes.filterNodes({})
      .filter(function (node) { return node.variables; })
      .map(function (node) { return JSON.parse(node.variables); })
      .map(function (variables) {
        if (variables[nodeType]) {
          variables[nodeType].map(function () {
            allVariables = allVariables.concat(variables[nodeType]);
          });
        }
      });
  }

  return allVariables.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

module.exports = findVariables;
