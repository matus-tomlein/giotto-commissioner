function findVariables(type) {
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

function variableToId(id) {
  return id.replace(/[\s+.,]/g, '-').toLowerCase();
}

function createInput(name, type) {
  var content = '<div class="form-row"> <label><i class="fa fa-tag"></i> <span>'
    + name + '</span></label><select id="'
    + variableToId(name) + '" data-id="' + name + '" class="' + type + '">';

  content += findVariables(type).map(function (variable) {
    return '<option>' + variable + '</option>';
  }).join('');
  content += '</select></div>';

  return content;
}
