function NodePath(forwardLinks = {}) {
  this.forwardLinks = forwardLinks;
}

NodePath.prototype.clone = function () {
  return new NodePath(JSON.parse(JSON.stringify(this.forwardLinks)));
};

NodePath.prototype.addChild = function (parent, child, positive) {
  var positiveKey = positive ? 'positive' : 'negative';

  if (!this.forwardLinks[parent.id]) {
    this.forwardLinks[parent.id] = {
      positive: [],
      negative: []
    };
  }
  this.forwardLinks[parent.id][positiveKey].push(child.id);
};

NodePath.prototype.childrenOf = function (node, positive = true) {

};

module.exports = NodePath;
