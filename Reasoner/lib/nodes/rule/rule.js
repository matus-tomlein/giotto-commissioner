var Rule = require('../Rule');

module.exports = function (RED) {
  function RuleNode(config) {
    var node = this;
    this.config = config;

    RED.nodes.createNode(node, config);

    node.assigned = function (nodes, ancestors) {
      var items = [];
      var jsonData = JSON.parse(config.jsonData);

      jsonData.rules.forEach(function (r) {
        var rule = new Rule();
        rule.label = config.label;
        rule.ruleItems = r;

        items = items.concat(rule.assigned(nodes, ancestors));
      });

      return items;
    };
  }

  RED.nodes.registerType('rule', RuleNode);
};
