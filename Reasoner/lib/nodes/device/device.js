var Device = require('../Device'),
    CaseReasoner = require('../../index'),
    NegatedCondition = CaseReasoner.NegatedCondition,
    Resource = require('../Resource');

module.exports = function (RED) {
  function DeviceNode(config) {
    var node = this;
    this.config = config;
    this.preconditionItems = [];
    this.variables = { Device: {}, Resource: {} };

    RED.nodes.createNode(node, config);

    this.initialize = function (nodes, ancestors) {
      if (this.initialized) return;
      this.initialized = true;

      this.initializeDevices(nodes, ancestors);
      this.initializeResources(nodes, ancestors);
    };

    this.initializeDevices = function (nodes, ancestors) {
      var that = this;
      var jsonData = JSON.parse(config.jsonData);

      jsonData.devices.forEach(function (dev) {
        var device = new Device(dev.variable);
        device.parentNode = that;
        device.characteristics = dev.characteristics;

        that.preconditionItems = that.preconditionItems.concat(device.precondition(ancestors));

        that.variables.Device[dev.variable] = device;
      });
    };

    this.initializeResources = function () {
      var that = this;
      var jsonData = JSON.parse(config.jsonData);

      jsonData.resources.forEach(function (res) {
        var resource = new Resource(res.variable);

        that.preconditionItems = that.preconditionItems.concat(resource.precondition());

        that.variables.Resource[res.variable] = resource;
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

    node.ontology = function () {
      var ontology = [];
      var jsonData = JSON.parse(config.jsonData);

      jsonData.resources.forEach(function (res) {
        var resource = new Resource(res.variable);
        ontology = ontology.concat(resource.ontology());
      });

      return ontology;
    };
  }

  RED.nodes.registerType('Device', DeviceNode);
};
