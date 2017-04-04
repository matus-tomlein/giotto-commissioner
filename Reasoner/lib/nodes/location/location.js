var hashString = require('../hashString'),
    Variables = require('../Variables'),
    CaseReasoner = require('../../index'),
    NegatedCondition = CaseReasoner.NegatedCondition,
    Location = require('../Location');

module.exports = function (RED) {
  function LocationNode(config) {
    RED.nodes.createNode(this, config);

    this.nodeId = hashString(config.variable);

    var loc = new Location(this.nodeId);

    this.variableName = loc.variableName;
    this.variables = { Location: {} };
    this.variables.Location[config.variable] = loc;

    this.status({});

    this.initialize = function (nodes, ancestors) {
      if (this.initialized) return;
      this.initialized = true;

      var vars = new Variables(nodes, ancestors);
      var locationTypeNode = vars.getVariable(config.locationType, 'Location type');
      if (locationTypeNode) {
        loc.locationType = locationTypeNode;
      } else {
        this.status({fill:'red',shape:'ring',text:'Location type reference invalid.'});
      }
    };

    this.location = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);
      return loc;
    };

    this.precondition = function (nodes, ancestors) {
      return this.location(nodes, ancestors).precondition(ancestors);
    };

    this.negativePrecondition = function (nodes, ancestors) {
      var location = this.location(nodes, ancestors);

      var condition = new NegatedCondition([location.variableName],
          location.precondition(ancestors));
      return [condition];
    };

  }

  RED.nodes.registerType('Location', LocationNode);
};
