var saveWorkspaceData = require('./saveWorkspaceData'),
    processCharacteristics = require('./processCharacteristics'),

    $ = require('jquery');

function SaveDevicesNode() {
}

SaveDevicesNode.prototype = (function () {

  function processBlocklyData(data) {
    var jq = $(data);
    var devices = [];
    var resources = [];
    var variables = { Device: [], Resource: [] };

    jq.find('block[type="device"]').each(function (i, dev) {
      var variable = $(dev).find('field[name="label"]').text();
      var characteristics = processCharacteristics(dev);

      variables.Device.push(variable);
      devices.push({
        variable: variable,
        characteristics: characteristics
      });
    });

    jq.find('block[type="resource"]').each(function (i, res) {
      var variable = $(res).find('field[name="label"]').text();

      variables.Resource.push(variable);
      resources.push({
        variable: variable
      });
    });

    return {
      jsonData: JSON.stringify({
        resources: resources,
        devices: devices
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

module.exports = SaveDevicesNode;
