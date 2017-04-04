var SemanticRule = require('./SemanticRule');

function RuleCollapser() {
}

RuleCollapser.prototype.createCollapsedRules = function (rule, parentPrecondition, parentRequiredProperties) {
  var that = this;
  var collapsedRule = new SemanticRule();
  collapsedRule.precondition = rule.precondition;

  if (parentPrecondition) {
    collapsedRule.precondition = parentPrecondition.concat(collapsedRule.precondition);
  }

  if (parentRequiredProperties) {
    collapsedRule.requiresPropertyTypes = parentRequiredProperties;
  }
  collapsedRule.requiresPropertyTypes = collapsedRule.requiresPropertyTypes.concat(
      rule.requiresPropertyTypes);

  var collapsedRules = [];

  if (rule.hasChildRules()) {
    rule.childRules.forEach(function (childRule) {
      var createdChildRules = that.createCollapsedRules(childRule, collapsedRule.precondition, collapsedRule.requiresPropertyTypes);
      collapsedRules = collapsedRules.concat(createdChildRules);
    });
  }

  if (rule.hasPostconditionItems()) {
    collapsedRule.postcondition = rule.postcondition;
    collapsedRule.satisfiesPropertyTypes = rule.satisfiesPropertyTypes;
    collapsedRules.push(collapsedRule);
  }

  return collapsedRules;
};

module.exports = RuleCollapser;
