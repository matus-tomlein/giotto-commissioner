function NodePathGenerator(nodes) {
  this.nodes = nodes;
}

NodePathGenerator.prototype.generate = function () {
  var that = this;

  var startNodes = that.nodes.enabledStartNodes();
  var paths = [];

  startNodes.forEach(function (node) {
    paths = paths.concat(that.pathsFrom(node, new NodePath()));
  });
};

NodePathGenerator.prototype.pathsFrom = function (node, path) {
  var that = this;

  var childPaths = [];

  this.nodes.childrenOf(node, true).forEach(function (child) {
    var childPath = path.clone();
    childPath.addChild(node, child, true);

    childPaths = childPaths.concat(that.pathsFrom(child, childPath));
  });

  this.nodes.childrenOf(node, false).forEach(function (child) {
    var childPath = path.clone();
    childPath.addChild(node, child, false);

    childPaths = childPaths.concat(that.pathsFrom(child, childPath));
  });

  if (childPaths.length)
    return childPaths;

  return [path];
};

module.exports = NodePathGenerator;
