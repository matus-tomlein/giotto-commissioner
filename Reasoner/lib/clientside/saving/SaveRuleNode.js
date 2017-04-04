var saveWorkspaceData = require('./saveWorkspaceData'),

    $ = require('jquery');

function SaveRuleNode() {
}

SaveRuleNode.prototype = (function () {

  function processNode(node) {
    var info = { };
    var service = node.find('field[name="service"]:first').text();
    var value = node.find('field[name="value"]:first').text();

    switch (node.attr('type')) {
    case 'if_for_event_service':
      info.virtualSensor = service;
      info.value = value;
      break;

    case 'if_for_boolean_service':
      info.provider = service;
      info.value = value == 1;
      break;

    case 'if_for_numeric_service':
      info.provider = service;
      info.value = value;
      info.operator = node.find('field[name=operator]:first').text();
      break;

    case 'then_for_trigger_service':
      info.consumer = service;
      break;

    case 'then_for_boolean_service':
      info.consumer = service;
      info.value = value == 1;
      break;

    case 'then_for_numeric_service':
      info.consumer = service;
      info.value = value;
      break;
    }

    return info;
  }

  function createRuleChain(root, parents) {
    parents.push(processNode(root));

    var next = root.find('block:first');
    if (next.length) {
      createRuleChain(next, parents);
    }
    return parents;
  }

  function processBlocklyData(data) {
    var jq = $(data);

    // get the root elements
    var first = jq.find(':first');
    var siblings = first.siblings();

    var rules = first.toArray().concat(siblings.toArray()).map(function (root) {
      return createRuleChain($(root), []);
    });

    return {
      jsonData: JSON.stringify({
        rules: rules
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

module.exports = SaveRuleNode;
