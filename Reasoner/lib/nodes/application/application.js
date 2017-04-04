var hashString = require('../hashString'),
    Device = require('../Device'),
    Service = require('../Service'),
    Location = require('../Location'),
    Resource = require('../Resource'),
    Property = require('../Property'),
    VirtualSensor = require('../VirtualSensor'),
    PropertyType = require('../PropertyType');

module.exports = function (RED) {
  function Application(config) {
    var node = this;
    this.config = config;
    this.variables = {
      Device: {},
      Resource: {},
      VirtualSensor: {},
      DataProvider: {},
      DataConsumer: {},
      Location: {},
      Property: {}
    };
    this.preconditionItems = [];

    var propertyType = new PropertyType(hashString(config.name));
    this.requiresPropertyTypes = [propertyType.uri];

    RED.nodes.createNode(node, config);

    node.initialize = function (nodes, ancestors) {
      var that = this;

      var jsonData = JSON.parse(config.jsonData);
      var property = new Property(config.name);
      property.propertyTypeUri = propertyType.uri;
      that.variables.Property[property.variableName] = property;

      property.parameters = jsonData.parameters.map(function (parameter, i) {
        var variableName = '?appParam' + i;
        switch (parameter.accepts) {
        case 'Device':
          var device = new Device(parameter.name);
          variableName = device.variableName;
          that.variables.Device[parameter.name] = device;
          break;

        case 'VirtualSensor':
          var virtualSensor = new VirtualSensor(parameter.name);
          variableName = virtualSensor.variableName;
          that.variables[parameter.accepts][parameter.name] = virtualSensor;
          break;

        case 'DataProvider':
        case 'DataConsumer':
          var service = new Service(parameter.name);
          variableName = service.variableName;
          that.variables[parameter.accepts][parameter.name] = service;
          break;

        case 'Location':
          var location = new Location(parameter.name);
          variableName = location.variableName;
          that.variables.Location[parameter.name] = location;
          break;

        case 'Resource':
          var resource = new Resource(parameter.name);
          variableName = resource.variableName;
          that.variables.Resource[parameter.name] = resource;
          break;
        }

        return {
          accepts: '__variableName',
          value: variableName,
          uri: propertyType.parameterUri(parameter.name)
        };
      });

      that.preconditionItems = property.precondition(nodes, ancestors);
    };

    node.precondition = function (nodes, ancestors) {
      this.initialize(nodes, ancestors);
      return this.preconditionItems;
    };

    node.ontology = function () {
      var jsonData = JSON.parse(config.jsonData);

      propertyType.name = config.name;
      propertyType.kind = 'application';
      propertyType.parameters = jsonData.parameters;
      propertyType.tags = jsonData.tags;

      return propertyType.ontology();
    };
  }

  RED.nodes.registerType('application', Application);
};
