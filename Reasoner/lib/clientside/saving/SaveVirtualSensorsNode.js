var saveWorkspaceData = require('./saveWorkspaceData'),

    $ = require('jquery');

function SaveVirtualSensorsNode() {
}

SaveVirtualSensorsNode.prototype = (function () {

  function processBlocklyData(data) {
    var jq = $(data);
    var virtualSensors = [];
    var variables = { VirtualSensor: [], VirtualSensorLabel: [] };

    jq.find('block[type="virtual_sensor"]').each(function (i, block) {
      var variable = $(block).find('field[name="label"]:first').text();

      var inputs = [];
      var inputBlocks = $(block).find('statement[name="inputs"] block');
      inputBlocks.each(function (i, inputBlock) {
        inputs.push($(inputBlock).find('field[name="data_provider"]:first').text());
      });

      var labels = [];
      var labelBlocks = $(block).find('statement[name="labels"] block');
      labelBlocks.each(function (i, labelBlock) {
        var label = $(labelBlock).find('field[name="label"]:first').text();
        labels.push(label);
        variables.VirtualSensorLabel.push(label);
      });

      variables.VirtualSensor.push(variable);
      virtualSensors.push({
        variable: variable,
        inputs: inputs,
        labels: labels
      });
    });

    return {
      jsonData: JSON.stringify({
        virtualSensors: virtualSensors
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

module.exports = SaveVirtualSensorsNode;
