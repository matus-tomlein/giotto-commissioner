var saveWorkspaceData = require('./saveWorkspaceData'),

    $ = require('jquery');

function SaveDefinitionNode() {
}

SaveDefinitionNode.prototype = (function () {

  function processBlocklyData(data) {
    var jq = $(data);
    var locationTypes = [];
    var flowTypes = [];
    var propertyTypes = [];
    var variables = {
      'Location type': [],
      'Flow type': [],
      'Relation type': []
    };

    jq.find('block[type="location_type"]').each(function (i, loc) {
      var name = $(loc).find('field[name="name"]').text();

      variables['Location type'].push(name);
      locationTypes.push({
        name: name
      });
    });

    jq.find('block[type="flow_type"]').each(function (i, loc) {
      var name = $(loc).find('field[name="name"]').text();
      var description = $(loc).find('field[name="description"]').text();

      variables['Flow type'].push(name);
      flowTypes.push({
        name: name,
        description: description
      });
    });

    jq.find('block[type="property_type"]').each(function (i, prop) {
      var name = $(prop).find('field[name="name"]:first').text();
      var kind = $(prop).find('field[name="kind"]:first').text();
      var parameters = [];

      $(prop).find('block[type="property_type_parameter"]').each(function (i, parameter) {
        parameters.push({
          name: $(parameter).find('field[name="name"]:first').text(),
          accepts: $(parameter).find('field[name="accepts"]:first').text() || 'Select'
        });
      });

      $(prop).find('block[type="property_type_select_parameter"]').each(function (i, parameter) {
        var options = [];
        $(parameter).find('statement:first field[name="option"]').each(function (i, option) {
          options.push($(option).text());
        });

        parameters.push({
          name: $(parameter).find('field[name="name"]:first').text(),
          accepts: 'Select',
          options: options
        });
      });

      propertyTypes.push({
        name: name,
        kind: kind,
        parameters: parameters
      });
    });

    return {
      jsonData: JSON.stringify({
        locationTypes: locationTypes,
        flowTypes: flowTypes,
        propertyTypes: propertyTypes
      }),
      variables: JSON.stringify(variables)
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

module.exports = SaveDefinitionNode;
