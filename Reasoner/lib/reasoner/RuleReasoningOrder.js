var _ = require('underscore');

function RuleReasoningOrder(rules) {
  this.allRules = {};
  this.unprocessedRules = [];
  this.processedRules = [];
  this.cancelled = false;

  var that = this;
  rules.forEach(function (rule) {
    that.allRules[rule.id] = rule;
    that.unprocessedRules.push(rule.id);
  });
}

RuleReasoningOrder.prototype.ruleProcessingFinished = function (rule) {
  this.processedRules.push(rule.id);
  this.unprocessedRules = _.without(this.unprocessedRules, rule.id);
};

RuleReasoningOrder.prototype.getNextRulesToReason = function () {
  var that = this;
  var rulesToReason = [];

  this.unprocessedRules.forEach(function (ruleId) {
    var rule = that.allRules[ruleId];

    var requiredRules = [];
    rule.requiresPropertyTypes.forEach(function (propertyType) {
      requiredRules = requiredRules.concat(that.ruleIdsThatSatisfyPropertyType(propertyType));
    });

    var requiredUnprocessedRules = [];
    requiredRules.forEach(function (ruleId) {
      if (!_.contains(that.processedRules, ruleId))
        requiredUnprocessedRules.push(ruleId);
    });

    if (requiredUnprocessedRules.length == 0) {
      rulesToReason.push(rule);
    }
  });

  rulesToReason.forEach(function (rule) {
    that.unprocessedRules = _.without(that.unprocessedRules, rule.id);
  });

  return rulesToReason;
};

RuleReasoningOrder.prototype.ruleIdsThatSatisfyPropertyType = function (propertyType) {
  var that = this;
  var rules = [];

  for (var ruleId in this.allRules) {
    var rule = that.allRules[ruleId];
    if (_.contains(rule.satisfiesPropertyTypes, propertyType)) {
      rules.push(ruleId);
    }
  }

  return rules;
};

RuleReasoningOrder.prototype.hasUnprocessedRules = function () {
  return this.unprocessedRules.length > 0;
};

RuleReasoningOrder.prototype.allRulesProcessed = function () {
  return this.processedRules.length == Object.keys(this.allRules).length;
};

module.exports = RuleReasoningOrder;
