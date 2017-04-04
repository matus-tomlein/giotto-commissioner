var api = require('./externalApi');
var _ = require('underscore');

function findServices() {
  var RED = api.RED;
  if (!RED) return [];

  var services = RED.nodes.filterNodes({})
    .filter(function (node) { return node.type == 'service' && node.jsonData; })
    .map(function (node) { return JSON.parse(node.jsonData); })
    .filter(function (data) { return data && data.services; })
    .map(function (data) { return data.services; });

  return _.flatten(services);
}

module.exports = findServices;
