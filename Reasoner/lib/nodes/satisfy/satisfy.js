var Property = require('../Property');

module.exports = function (RED) {
  function Satisfy(config) {
    RED.nodes.createNode(this, config);

    var node = this;

    this.clearSettings = function () {
      this.variables = { Property: {} };
      this.preconditionItems = [];
      this.assignedItems = [];
      this.satisfiesPropertyTypes = [];
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
        that.assignedItems = that.assignedItems.concat(property.assigned(nodes, ancestors));
        that.satisfiesPropertyTypes.push(prop.uri);
        that.requiresPropertyTypes.push(prop.uri);
      });
    };

    node.precondition = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);
      return this.preconditionItems;
    };

    node.assigned = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);
      return this.assignedItems;
    };

  }

  RED.nodes.registerType('Satisfy property', Satisfy);
};
