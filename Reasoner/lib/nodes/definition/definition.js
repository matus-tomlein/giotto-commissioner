var hashString = require('../hashString'),
    LocationType = require('../LocationType'),
    PropertyType = require('../PropertyType'),
    FlowType = require('../FlowType');

module.exports = function (RED) {
  function Definition(config) {
    var node = this;
    this.config = config;
    this.variables = {
      'Location type': {},
      'Flow type': {},
      'Property type': {}
    };

    RED.nodes.createNode(node, config);

    this.initialize = function () {
      if (this.initialized) return;
      this.initialized = true;

      var that = this;
      var jsonData = JSON.parse(config.jsonData);

      jsonData.locationTypes.forEach(function (def) {
        var locationType = new LocationType(hashString(def.name));
        locationType.name = def.name;

        that.variables['Location type'][def.name] = locationType;
      });

      jsonData.flowTypes.forEach(function (def) {
        var flowType = new FlowType(hashString(def.name));
        flowType.name = def.name;
        flowType.description = def.description;

        that.variables['Flow type'][def.name] = flowType;
      });

      jsonData.propertyTypes.forEach(function (def) {
        var propertyType = new PropertyType(hashString(def.name));
        propertyType.name = def.name;
        propertyType.kind = def.kind;
        propertyType.parameters = def.parameters;
        propertyType.tags = def.tags;

        that.variables['Property type'][def.name] = propertyType;
      });

    };

    node.ontology = function () {
      this.initialize();
      var items = [];

      for (var name in this.variables['Location type']) {
        var locationType = this.variables['Location type'][name];
        items = items.concat(locationType.ontology());
      }

      for (var flowName in this.variables['Flow type']) {
        var flowType = this.variables['Flow type'][flowName];
        items = items.concat(flowType.ontology());
      }

      for (var propertyName in this.variables['Property type']) {
        var propertyType = this.variables['Property type'][propertyName];
        items = items.concat(propertyType.ontology());
      }

      return items;
    };
  }

  RED.nodes.registerType('Definition', Definition);
};
