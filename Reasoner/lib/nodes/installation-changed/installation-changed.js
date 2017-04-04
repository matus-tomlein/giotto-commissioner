var Nodes = require('../../reasoner/Nodes');
var reasonerInstance = require('../../instance');

var runningTimeout = false;

function start() {
  if (!runningTimeout) {
    runningTimeout = true;
    setTimeout(timedOut, 2000);
  }
}

function timedOut() {
  runningTimeout = false;
  var reasoner = reasonerInstance();
  var RED = reasoner.RED;

  var nodes = new Nodes(RED);
  reasoner.setNodes(nodes);
  console.log('Nodes initialized');
}

module.exports = function (RED) {
  function InstallationChanged(config) {
    RED.nodes.createNode(this, config);
    this.enabled = config.disabled != true;
    this.suggestPotentialPlacements = config.suggestPotentialPlacements;
    this.suggestPotentialRelations = config.suggestPotentialRelations;
    this.suggestPotentialResources = config.suggestPotentialResources;
    this.suggestPotentialDeviceRoles = config.suggestPotentialDeviceRoles;
    this.config = config;

    start();
  }

  RED.nodes.registerType('Start', InstallationChanged);
};
