var saveWorkspaceData = require('./saveWorkspaceData'),
    blockSettings = require('../blockSettings'),

    $ = require('jquery');

function SavePropertyNode() {
}

SavePropertyNode.prototype = (function () {

  function processBlocklyData(data) {
    var jq = $(data);
    var properties = [];

    var propertyTypes = blockSettings.propertyTypes;

    propertyTypes.map(function (propertyType) {
      jq.find('block[type="' + propertyType.blockName + '"]').each(function (i, dev) {
        var type = $(dev).attr('type');
        var parameters = [];

        propertyType.parameters.map(function (parameterType) {
          $(dev).find('field[name="' + parameterType.uri + '"]').each(function (i, parameter) {
            parameters.push({
              uri: parameterType.uri,
              accepts: parameterType.accepts,
              value: $(parameter).text()
            });
          });
        });

        properties.push({
          uri: type,
          title: propertyType.title,
          parameters: parameters
        });
      });
    });

    return {
      jsonData: JSON.stringify({
        properties: properties
      })
    };
  }

  return {
    save: function () {
      var results = {
        data: saveWorkspaceData()
      };

      return Object.assign(results, processBlocklyData(results.data));
    }
  };
})();

module.exports = SavePropertyNode;
