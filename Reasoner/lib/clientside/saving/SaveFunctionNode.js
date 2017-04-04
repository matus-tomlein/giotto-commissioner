var saveWorkspaceData = require('./saveWorkspaceData'),

    $ = require('jquery');

function SaveFunctionNode() {
}

SaveFunctionNode.prototype = (function () {

  function processBlocklyData(data) {
    var jq = $(data);
    var variables = {
      Device: [],
      Resource: [],
      Location: []
    };

    jq.find('block[type="function_attribute"]').each(function (i, dev) {
      var name = $(dev).find('field[name="name"]').text();
      var type = $(dev).find('field[name="type"]').text();

      variables[type].push(name);
    });

    return {
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

module.exports = SaveFunctionNode;
