var Property = require('../Property');

module.exports = function (RED) {
  function Require(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    this.clearSettings = function () {
      this.variables = { Property: {} };
      this.preconditionItems = [];
      this.requiresPropertyTypes = [];
    };

    node.initialize = function (nodes, ancestors) {
      var that = this;
      if (this.initializedWith == ancestors) return;
      this.initializedWith = ancestors;
      this.clearSettings();

      var jsonData = JSON.parse(config.jsonData);
      jsonData.properties.forEach(function (prop, i) {
        var property = new Property(config.id + '_' + i);
        property.propertyTypeUri = prop.uri;
        property.parameters = prop.parameters;

        that.variables.Property[property.variableName] = property;
        that.preconditionItems = that.preconditionItems.concat(property.precondition(nodes, ancestors));
        that.requiresPropertyTypes.push(prop.uri);
      });
    };

    node.precondition = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);
      return this.preconditionItems;
    };

  }

  RED.nodes.registerType('Require property', Require);
};
