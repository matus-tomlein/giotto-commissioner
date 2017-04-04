function Variables(nodes, ancestors) {
  this.nodes = nodes;
  this.ancestors = ancestors;
}

Variables.prototype.getVariable = function (name, type) {
  for (var i = this.ancestors.length - 1; i >= 0; i--) {
    var ancestor = this.ancestors[i];

    if (ancestor.variables &&
        ancestor.variables[type] &&
        ancestor.variables[type][name]) {
      return ancestor.variables[type][name];
    }
  }

  var found = this.nodes.ontologyNodes().find(function (node) {
    if (node.variables &&
        node.variables[type] &&
        node.variables[type][name]) {
      return true;
    }
    return false;
  });
  if (found) return found.variables[type][name];

  found = this.nodes.findNodeForVariable(name, type);
  // if (!found) {
  //   console.trace('Failed to find variable ' + name + ' with type ' + type);
  // }

  return found;
};

module.exports = Variables;
