var saveWorkspaceData = require('./saveWorkspaceData'),

    $ = require('jquery');

function SaveLayoutNode() {
}

SaveLayoutNode.prototype = (function () {

  function processBlocklyData(data) {
    var jq = $(data);
    var locations = [];
    var flows = [];

    jq.find('block[type="location"]').each(function (i, loc) {
      var name = $(loc).find('field[name="location"]').text();
      var devices = [];
      var resources = [];

      $(loc).find('field[name="device"]').each(function (i, device) {
        devices.push($(device).text());
      });
      $(loc).find('field[name="resource"]').each(function (i, resource) {
        resources.push($(resource).text());
      });

      locations.push({
        name: name,
        devices: devices,
        resources: resources
      });
    });

    jq.find('block[type="flow"]').each(function (i, flow) {
      var type = $(flow).find('field[name="type"]').text();

      var lastNode = null;
      var foundFlows = [];
      var addedItems = [];

      $(flow).find('block').each(function (i, block) {
        block = $(block);
        if (addedItems.includes(block.attr('id'))) return;

        var node = null;

        if (block.attr('type') == 'device_input') {
          node = {
            device: block.find('field[name=device]:first').text()
          };
        }
        else if (block.attr('type') == 'resource_input') {
          node = {
            resource: block.find('field[name=resource]:first').text()
          };
        }
        else if (block.attr('type') == 'join_input') {
          node = {
            join: block.find('field[name=id]:first').text()
          };
        }
        else if (block.attr('type') == 'external_input') {
          node = {
            external: block.find('field[name=external]:first').text()
          };
        }
        else if (block.attr('type') == 'flow_group') {
          var groupDevices = [];
          var groupResources = [];

          block.find('statement:first block').each(function (i, block) {
            addedItems.push($(block).attr('id'));
          });

          block.find('statement:first field[name=resource]').each(function (i, resource) {
            groupResources.push($(resource).text());
          });

          block.find('statement:first field[name=device]').each(function (i, device) {
            groupDevices.push($(device).text());
          });

          node = {
            id: block.attr('id'),
            devices: groupDevices,
            resources: groupResources
          };
        }

        if (node) {
          if (lastNode) {
            foundFlows.push({
              of: lastNode,
              to: node
            });
          }

          lastNode = node;
        }
      });

      flows.push({
        type: type,
        flows: foundFlows
      });
    });

    return {
      jsonData: JSON.stringify({
        locations: locations,
        flows: flows
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

module.exports = SaveLayoutNode;
