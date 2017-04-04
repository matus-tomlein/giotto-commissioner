var saveWorkspaceData = require('./saveWorkspaceData'),

    $ = require('jquery');

function SaveApplicationNode() {
}

SaveApplicationNode.prototype = (function () {

  function processBlocklyData(data) {
    var jq = $(data);
    var parameters = [];
    var tags = [];
    var variables = {
      'Device': [],
      'Resource': [],
      'VirtualSensor': [],
      'DataProvider': [],
      'DataConsumer': [],
      'Location': []
    };

    jq.find('block[type="application_parameter"]').each(function (i, parameter) {
      var name = $(parameter).find('field[name="name"]:first').text();
      var accepts = $(parameter).find('field[name="accepts"]:first').text() || 'Select';

      if (variables[accepts])
        variables[accepts].push(name);

      parameters.push({
        name: name,
        accepts: accepts
      });
    });

    jq.find('block[type="application_tag"]').each(function (i, parameter) {
      var tag = $(parameter).find('field[name="tag"]:first').text();

      tags.push(tag);
    });

    return {
      jsonData: JSON.stringify({
        tags: tags,
        parameters: parameters
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

module.exports = SaveApplicationNode;
