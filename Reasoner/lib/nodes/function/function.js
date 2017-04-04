module.exports = function (RED) {
  function DefineFunction(config) {
    RED.nodes.createNode(this, config);
  }

  RED.nodes.registerType('Function', DefineFunction);
};
