var N3 = require('n3'),
    N3Util = N3.Util,
    vocab = require('./vocabulary');

function NodeToRuleTransformer(node, nodes) {
  this.node = node;
  this.nodes = nodes;
}

NodeToRuleTransformer.prototype.canShareRuleWithParent = function () {
  if (this.node.assigned || this.node.facts)
    return false;

  if (this.hasNegativeBranch())
    return false;

  return true;
};

NodeToRuleTransformer.prototype.canShareRuleWithChildren = function () {
  if (this.hasNegativeBranch())
    return false;

  if (this.node.postcondition)
    return false;

  var children = this.nodes.childrenOf(this.node);
  if (children.length > 1)
    return false;

  return true;
};

NodeToRuleTransformer.prototype.hasPositiveBranch = function () {
  // return this.nodes.nodesInfo[this.node.id].positiveWires > 0;
  return true;
};

NodeToRuleTransformer.prototype.hasNegativeBranch = function () {
  return this.nodes.nodesInfo[this.node.id].negativeWires > 0 &&
    this.node.negativePrecondition;
};

NodeToRuleTransformer.prototype.updateParentRule = function(parentRule, flowParents) {
  var node = this.node;
  var nodes = this.nodes;

  try {
    if (node.facts) {
      node.facts(nodes, flowParents).forEach(function (fact) {
        parentRule.postcondition.push(fact);
      });
    }

    if (node.assigned) {
      node.assigned(nodes, flowParents).forEach(function (assigned) {
        parentRule.postcondition.push(assigned);
      });
    }
  }
  catch(err) {
    console.log(err.message);
    console.error(err.stack);
  }
};

NodeToRuleTransformer.prototype.updatePositiveRule = function (rule, flowParents) {
  var node = this.node;
  var nodes = this.nodes;

  try {
    if (node.precondition) {
      var pre = node.precondition(nodes, flowParents);
      rule.precondition = rule.precondition.concat(pre);
    }

    if (node.postcondition) {
      var post = node.postcondition(nodes, flowParents);
      rule.postcondition = rule.postcondition.concat(post);
    }
  }
  catch(err) {
    console.log(err.message);
    console.error(err.stack);
  }
};

NodeToRuleTransformer.prototype.updateNegativeRule = function (rule, flowParents) {
  var node = this.node;
  var nodes = this.nodes;

  try {
    var pre = node.negativePrecondition(nodes, flowParents);
    rule.precondition = rule.precondition.concat(pre);
  }
  catch(err) {
    console.log(err.message);
    console.error(err.stack);
  }
};

NodeToRuleTransformer.prototype.updateRequiredPropertyTypes = function (rule) {
  if (this.node.requiresPropertyTypes) {
    rule.requiresPropertyTypes = rule.requiresPropertyTypes.concat(this.node.requiresPropertyTypes);
  }
};

NodeToRuleTransformer.prototype.updateSatisfiedPropertyTypes = function (rule) {
  if (this.node.satisfiesPropertyTypes) {
    rule.satisfiesPropertyTypes = rule.satisfiesPropertyTypes.concat(this.node.satisfiesPropertyTypes);
  }
};

module.exports = NodeToRuleTransformer;
