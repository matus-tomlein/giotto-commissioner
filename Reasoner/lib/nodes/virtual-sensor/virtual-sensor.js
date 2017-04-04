var VirtualSensor = require('../VirtualSensor'),
    CaseReasoner = require('../../index'),
    NegatedCondition = CaseReasoner.NegatedCondition;

module.exports = function (RED) {
  function VirtualSensorNode(config) {
    var node = this;
    this.config = config;

    RED.nodes.createNode(node, config);

    this.initialize = function (nodes, ancestors) {
      this.preconditionItems = [];
      this.assignedItems = [];
      this.variables = { VirtualSensor: {} };

      var that = this;
      var jsonData = JSON.parse(config.jsonData);

      jsonData.virtualSensors.forEach(function (info) {
        var virtualSensor = new VirtualSensor(info.variable);
        virtualSensor.inputs = info.inputs;
        virtualSensor.labels = info.labels;

        that.preconditionItems = that.preconditionItems.concat(virtualSensor.precondition(nodes, ancestors));
        that.assignedItems = that.assignedItems.concat(virtualSensor.assigned(nodes, ancestors));

        that.variables.VirtualSensor[info.variable] = virtualSensor;
      });
    };

    node.precondition = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);
      return this.preconditionItems;
    };

    node.negativePrecondition = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);
      var variables = [];

      for (var type in this.variables) {
        for (var variableName in this.variables[type]) {
          var object = this.variables[type][variableName];
          variables.push(object.variableName);
        }
      }

      var condition = new NegatedCondition(variables, this.preconditionItems);
      return [condition];
    };

    node.assigned = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);
      return this.assignedItems;
    };
  }

  RED.nodes.registerType('virtual-sensor', VirtualSensorNode);
};
