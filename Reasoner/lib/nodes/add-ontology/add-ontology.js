module.exports = function (RED) {
  function AddOntology(config) {
    RED.nodes.createNode(this, config);

    this.ontology = function () {
      return config.content;
    };
  }

  RED.nodes.registerType('Ontology', AddOntology);
};
