var CaseReasoner = require('../../index'),
    Variables = require('../Variables'),
    Service = require('../Service'),
    NegatedCondition = CaseReasoner.NegatedCondition;

module.exports = function (RED) {
  function ServiceNode(config) {
    var node = this;
    this.config = config;
    this.preconditionItems = [];
    this.variables = { DataProvider: {}, DataConsumer: {} };

    RED.nodes.createNode(node, config);

    this.initialize = function (nodes, ancestors) {
      if (this.initialized) return;
      this.initialized = true;

      this.initializeServices(nodes, ancestors);
    };

    this.initializeServices = function (nodes, ancestors) {
      var that = this;
      var jsonData = JSON.parse(config.jsonData);
      var vars = new Variables(nodes, ancestors);

      jsonData.services.forEach(function (srv) {
        var service = new Service(srv.variable);
        service.parentNode = that;
        service.serviceType = srv.type;
        if (srv.device)
          service.device = vars.getVariable(srv.device, 'Device');
        service.characteristics = srv.characteristics;

        that.preconditionItems = that.preconditionItems.concat(service.precondition(ancestors));

        if (service.serviceType == 'consumer')
          that.variables.DataConsumer[srv.variable] = service;
        else
          that.variables.DataProvider[srv.variable] = service;
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
  }

  RED.nodes.registerType('service', ServiceNode);
};
