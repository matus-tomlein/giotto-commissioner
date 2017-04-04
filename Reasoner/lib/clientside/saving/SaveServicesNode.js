var saveWorkspaceData = require('./saveWorkspaceData'),
    processCharacteristics = require('./processCharacteristics'),

    $ = require('jquery');

function SaveServicesNode() {
}

SaveServicesNode.prototype = (function () {

  function processServices(services, variables, jq, type, variableName) {
    jq.find('block[type="data_' + type + '"]').each(function (i, srv) {
      var variable = $(srv).find('field[name="label"]').text();
      var device = $(srv).find('field[name="device"]:first').text();

      var characteristics = processCharacteristics(srv);

      variables[variableName].push(variable);
      services.push({
        variable: variable,
        type: type,
        device: device,
        characteristics: characteristics
      });
    });
  }

  function processBlocklyData(data) {
    var jq = $(data);
    var services = [];
    var variables = { DataProvider: [], DataConsumer: [] };

    processServices(services,
        variables,
        jq, 'provider', 'DataProvider');
    processServices(services,
        variables,
        jq, 'consumer', 'DataConsumer');

    return {
      jsonData: JSON.stringify({
        services: services
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

module.exports = SaveServicesNode;
