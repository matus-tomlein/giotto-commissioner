var $ = require('jquery'),
    findServices = require('./findServices');

function Characteristic(data) {
  this.description = data.description;
  this.options = data.options;
  this.uri = data.uri;
  this.valueType = data.valueType;
  this.blockName = data.uri;
}

function PropertyType(data) {
  this.title = data.title;
  this.parameters = data.parameters;
  this.kind = data.kind;
  this.blockName = data.uri;
}

function Service(data) {
  this.type = data.type;
  this.dataType = data.dataType;
  this.variable = data.variable;
  this.device = data.device,
  this.characteristics = data.characteristics;

  if (data.type == 'consumer') {
    this.blockName = 'if-' + data.variable;
  } else {
    this.blockName = 'then-' + data.variable;
  }
}

function BlockSettings() {
  this.characteristics = [];
}

BlockSettings.prototype = (function () {

  return {
    loadCharacteristics: function (type, callback) {
      var that = this;
      $.getJSON('/api/' + type + '_characteristics', function (data) {
        that.characteristics = data.map(function (ch) {
          return new Characteristic(ch);
        });

        callback(null);
      });
    },

    loadPropertyTypes: function (callback) {
      var that = this;
      $.getJSON('/api/property_types', function (data) {
        that.propertyTypes = data.map(function (ch) {
          return new PropertyType(ch);
        });

        callback(null);
      });
    },

    findServices: function () {
      return findServices().map(function (service) {
        return new Service(service);
      });
    }
  };
})();

module.exports = new BlockSettings();
