var TriplesProcessor = require('./TriplesProcessor');

class OnePassReasoner {
  constructor(sources, nodes) {
    this.sources = sources;
    this.nodes = nodes;
  }

  reason(callback) {
    this.nodes.ontologyFor(this.sources, (err, ontology) => {
      ontology.process((err) => {
        if (err) {
          callback(err);
        } else {
          var triplesProcessor = new TriplesProcessor();
          var output = ontology.processed;

          triplesProcessor.fromDefinition(output, (err) => {
            if (err) {
              callback(err);
            } else {
              triplesProcessor.convertToNamedNodes();
              triplesProcessor.serialize((err, serialized) => {
                if (err) {
                  callback(err);
                } else {
                  callback(null, serialized);
                }
              });
            }
          });
        }
      });
    });
  }
}

module.exports = OnePassReasoner;
