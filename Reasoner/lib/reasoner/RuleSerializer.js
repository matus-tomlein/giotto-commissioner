var SemanticRule = require('./SemanticRule'),
    _ = require('underscore'),
    RuleCollapser = require('./RuleCollapser'),
    NodeToRuleTransformer = require('./NodeToRuleTransformer');

var RuleSerializer = function (nodes) {
  this.nodes = nodes;
};

RuleSerializer.prototype.getRules = function () {
  var that = this;

  var rules = that.nodes.enabledStartNodes().map(function (node) {
    return nodeToRule(node, { parentRule: new SemanticRule() }, that.nodes);
  });

  var collapser = new RuleCollapser();
  rules = _.flatten(rules.map(function (rule) {
    return collapser.createCollapsedRules(rule);
  }));

  return rules;
};

RuleSerializer.prototype.serialize = function (callback) {
  var rules = this.getRules();

  rulesToN3(rules, [], function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      var flowsResult = result.join('');
      callback(null, flowsResult);
    }
  });
};

function nodeToRule(node, rules, nodes, flowParents, onEndCallback) {
  flowParents = flowParents || [];

  var transformer = new NodeToRuleTransformer(node, nodes);
  transformer.updateParentRule(rules.parentRule, flowParents);
  transformer.updateSatisfiedPropertyTypes(rules.parentRule);

  if (transformer.hasPositiveBranch() || node.jumpTo) {
    var positiveRule = null;
    if (transformer.canShareRuleWithParent()) {
      positiveRule = rules.availableRule;
    }
    if (!positiveRule) {
      positiveRule = new SemanticRule();
      rules.parentRule.addChildRule(positiveRule);
    }

    transformer.updatePositiveRule(positiveRule, flowParents);
    transformer.updateRequiredPropertyTypes(positiveRule);

    var newRulesPositive = { parentRule: positiveRule };

    if (transformer.canShareRuleWithChildren()) {
      newRulesPositive.availableRule = positiveRule;
    }

    moveToNextRule(node, newRulesPositive, nodes, flowParents, true, onEndCallback);
  }

  if (transformer.hasNegativeBranch()) {
    var negativeRule = new SemanticRule();
    rules.parentRule.addChildRule(negativeRule);

    transformer.updateNegativeRule(negativeRule, flowParents);

    var newRulesNegative = { parentRule: negativeRule };
    moveToNextRule(node, newRulesNegative, nodes, flowParents, false, onEndCallback);
  }

  return rules.parentRule;
}

function moveToNextRule(node, rule, nodes, flowParents, positiveBranch, onEndCallback) {
  flowParents = flowParents || [];
  var moveToNext = function (newRule, newFlowParents) {
    var children = nodes.childrenOf(node, positiveBranch);
    if (children.length) {
      children.forEach(function (child) {
        nodeToRule(child, newRule, nodes, newFlowParents, onEndCallback);
      });
    } else if (onEndCallback) {
      onEndCallback(newRule, newFlowParents);
    }
  };

  if (node.jumpTo) {
    var jumpTo = node.jumpTo(nodes, flowParents);

    nodeToRule(jumpTo, rule, nodes, _.union(flowParents, [node]), moveToNext);
  }
  else {
    moveToNext(rule, _.union(flowParents, [node]));
  }
}

function rulesToN3(rules, n3, callback) {
  var rule = rules.pop();

  if (rule) {
    rule.toN3(function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        n3.push(result);
        rulesToN3(rules, n3, callback);
      }
    });
  } else {
    callback(null, n3);
  }
}

module.exports = RuleSerializer;
