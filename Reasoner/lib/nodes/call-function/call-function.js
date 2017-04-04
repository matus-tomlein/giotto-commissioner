var _ = require('underscore'),
    Variables = require('../Variables');

module.exports = function (RED) {
  function CallFunction(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    this.variables = {};

    this.initialize = function (nodes, ancestors) {
      if (this.initialized) return;
      this.initialized = true;
      var that = this;

      var json = JSON.parse(config.attributes);
      var vars = new Variables(nodes, ancestors);

      _.keys(json).forEach(function (type) {
        _.keys(json[type]).forEach(function (variable) {
          var value = json[type][variable];
          value = vars.getVariable(value, type);

          if (value) {
            that.variables[type] = that.variables[type] || {};
            that.variables[type][variable] = value;
          }
        });
      });
    };

    node.jumpTo = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);
      var vars = new Variables(nodes, ancestors);

      return vars.getVariable(config.functionVariable, 'Function');
    };
  }

  RED.nodes.registerType('Call function', CallFunction);
};
