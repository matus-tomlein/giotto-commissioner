var Variables = require('../Variables'),
    hashString = require('../hashString'),
    Location = require('../Location'),
    Placement = require('../Placement'),
    FlowLocation = require('../FlowLocation'),
    ExternalSystem = require('../ExternalSystem'),
    Join = require('../Join'),
    CaseReasoner = require('../../index'),
    NegatedCondition = CaseReasoner.NegatedCondition,
    _ = require('underscore'),
    Flow = require('../Flow');

module.exports = function (RED) {
  function Layout(config) {
    RED.nodes.createNode(this, config);

    this.nodeId = hashString(config.id);

    this.createId = function () {
      if (this.createdIdsCount) this.createdIdsCount++;
      else this.createdIdsCount = 1;

      return hashString(config.id + '_' + this.createdIdsCount);
    };

    this.clearSettings = function () {
      this.preconditionItems = [];

      this.variables = {
        Location: [],
        Placement: [],
        Flow: []
      };
    };

    this.initialize = function (nodes, ancestors) {
      if (this.initializedWith == ancestors) return;
      this.initializedWith = ancestors;
      this.clearSettings();

      this.initializeLocations(nodes, ancestors);
      this.initializeFlows(nodes, ancestors);
    };

    this.initializeLocations = function (nodes, ancestors) {
      var that = this;
      var jsonData = JSON.parse(config.jsonData);
      var vars = new Variables(nodes, ancestors);

      jsonData.locations.forEach(function (loc) {
        var id = hashString(loc.name);
        var location = null;

        if (loc.name.startsWith('__')) {
          var locationTypeName = loc.name.slice(2);
          var locationType = vars.getVariable(locationTypeName, 'Location type');

          id = Math.random().toString(36).substring(7);
          location = new Location(id);
          location.locationType = locationType;
          that.preconditionItems = that.preconditionItems.concat(location.precondition());
        } else {
          location = vars.getVariable(loc.name, 'Location');
        }

        if (location) {
          that.variables.Location.push(location);

          var createPlacement = function (callback) {
            var id = that.createId();
            var placement = new Placement(id);
            placement.inLocation = location;
            callback(placement);

            that.variables.Placement.push(placement);

            that.preconditionItems = that.preconditionItems.concat(placement.precondition());
          };

          loc.devices.forEach(function (device) {
            createPlacement(function (placement) {
              placement.ofDevice = vars.getVariable(device, 'Device');
            });
          });

          loc.resources.forEach(function (resource) {
            createPlacement(function (placement) {
              placement.ofResource = vars.getVariable(resource, 'Resource');
            });
          });
        }
      });
    };

    this.initializeFlows = function (nodes, ancestors) {
      var that = this;
      var jsonData = JSON.parse(config.jsonData);
      var vars = new Variables(nodes, ancestors);
      var joins = {};

      jsonData.flows.forEach(function (flowType) {
        var flowLocations = {};

        var getFlowLocation = function (node) {
          if (flowLocations[node.id])
            return flowLocations[node.id];

          var flowLocation = new FlowLocation();
          flowLocation.devices = node.devices.map(function (device) {
            return vars.getVariable(device, 'Device');
          });
          flowLocation.resources = node.resources.map(function (resource) {
            return vars.getVariable(resource, 'Resource');
          });
          flowLocations[node.id] = flowLocation;
          return flowLocation;
        };

        flowType.flows.forEach(function (fl) {
          var flow = new Flow(that.createId());

          if (fl.of.device) {
            flow.fromDevice = vars.getVariable(fl.of.device, 'Device');
          } else if (fl.of.resource) {
            flow.fromResource = vars.getVariable(fl.of.resource, 'Resource');
          } else if (fl.of.external) {
            flow.fromExternal = new ExternalSystem(fl.of.external);
          } else if (fl.of.join) {
            var join = new Join(config.id, fl.of.join);
            flow.fromJoin = join;
            joins[fl.of.join] = join;
          } else if (fl.of.id) {
            flow.fromFlowLocation = getFlowLocation(fl.of);
          }

          if (fl.to.device) {
            flow.toDevice = vars.getVariable(fl.to.device, 'Device');
          } else if (fl.to.resource) {
            flow.toResource = vars.getVariable(fl.to.resource, 'Resource');
          } else if (fl.to.join) {
            var joinTo = new Join(config.id, fl.to.join);
            flow.toJoin = joinTo;
            joins[fl.to.join] = joinTo;
          } else if (fl.to.external) {
            flow.toExternal = new ExternalSystem(fl.to.external);
          } else if (fl.to.id) {
            flow.toFlowLocation = getFlowLocation(fl.to);
          }

          flow.type = vars.getVariable(flowType.type, 'Flow type');

          that.preconditionItems = that.preconditionItems.concat(flow.precondition());
          that.variables.Flow.push(flow);
        });
      });

      for (var name in joins) {
        var join = joins[name];
        that.preconditionItems = that.preconditionItems.concat(join.precondition());
      }
    };

    this.precondition = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);

      return this.preconditionItems;
    };

    this.negativePrecondition = function (nodes, ancestors) {
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

    this.ontology = function () {
      var jsonData = JSON.parse(config.jsonData);
      var externals = [];

      jsonData.flows.forEach(function (flowType) {

        flowType.flows.forEach(function (fl) {
          if (fl.of.external) {
            externals.push(fl.of.external);
          }

          if (fl.to.external) {
            externals.push(fl.to.external);
          }
        });
      });

      var items = [];
      _.uniq(externals).forEach(function (name) {
        var external = new ExternalSystem(name);
        items = items.concat(external.ontology());
      });

      return items;
    };
  }

  RED.nodes.registerType('Layout', Layout);
};
