var _ = require('underscore'),
    ontologySources = require('./ontologySources'),
    Ontology = require('./Ontology');

var lastOntology = null;
var lastOntologySources = [];
var lastStore = null;

var Nodes = function Nodes(RED) {
  this.RED = RED;
  this.reasoner = null;

  this.initialize();
};

Nodes.prototype.initialize = function () {
  this.nodesInfo = {};
  initializeForwardLinks(this);
  initializeBackwardLinks(this);
};

Nodes.prototype.ontologyFor = function (sources, callback) {
  if (lastOntology && lastOntologySources == sources) {
    callback(null, lastOntology);
  }
  else {
    lastStore = null;
    var ontology = new Ontology(this);
    ontology.addSources(sources);
    lastOntology = ontology;
    lastOntologySources = sources;

    callback(null, ontology);
  }
};

Nodes.prototype.storeFor = function (sources, callback) {
  if (lastStore && lastOntologySources == sources) {
    return lastStore;
  }
  else {
    this.ontologyFor(sources, function (err, ontology) {
      if (err) {
        callback(err, null);
      } else {
        ontology.processDefinitions(function (err) {
          if (err) {
            callback(err, null);
          } else {
            ontology.parse(function (err, store) {
              if (err) {
                callback(err, null);
              } else {
                lastStore = store;
                callback(null, store);
              }
            });
          }
        });
      }
    });
  }
};

Nodes.prototype.ontologyNodes = function () {
  var RED = this.RED;

  var nodes = _.map(RED.nodes.getFlows(), function (nodeDef) {
    return RED.nodes.getNode(nodeDef.id);
  });

  return _.select(nodes, function (node) {
    return node && node.ontology;
  });
};

Nodes.prototype.enabledStartNodes = function () {
  return _.select(this.startNodes(), function (node) {
    return node.enabled != false;
  });
};

Nodes.prototype.startNodes = function () {
  var nodes = [];
  var RED = this.RED;

  var nodesDefs = _.select(RED.nodes.getFlows(), function (node) {
    return node.type == 'Start' ||
      node.type == 'application';
  });

  nodesDefs.forEach(function (nodeDef) {
    nodes.push(RED.nodes.getNode(nodeDef.id));
  });

  return nodes;
};

Nodes.prototype.functionNodes = function () {
  var nodes = [];
  var RED = this.RED;

  var nodesDefs = _.select(RED.nodes.getFlows(), function (node) {
    return node.type == 'Function';
  });

  nodesDefs.forEach(function (nodeDef) {
    nodes.push(RED.nodes.getNode(nodeDef.id));
  });

  return nodes;
};

Nodes.prototype.childrenOf = function (node, positive = true) {
  var that = this;
  var key = positive ? 'positive' : 'negative';

  if (this.forwardLinks[node.id] && this.forwardLinks[node.id][key]) {
    return this.forwardLinks[node.id][key].map(function (id) {
      return that.RED.nodes.getNode(id);
    });
  }
  return [];
};

Nodes.prototype.ancestorDeviceNodes = function (node) {
  var allAncestors = this.allAncestors(node, []);
  return _.select(allAncestors, function (ancestor) {
    return ancestor.constructor.name == 'Device';
  });
};

Nodes.prototype.allAncestors = function (node, ancestors) {
  ancestors = ancestors || [];
  var that = this;
  if (this.backwardLinks[node.id]) {
    this.backwardLinks[node.id].forEach(function (parentId) {
      var parentNode = that.RED.nodes.getNode(parentId);

      if (!_.contains(ancestors, parentNode)) {
        ancestors.push(parentNode);
        that.allAncestors(parentNode, ancestors);
      }
    });
  }
  return ancestors;
};

Nodes.prototype.findSources = function (done) {
  ontologySources(this, done);
};

Nodes.prototype.findNodeForVariable = function (variable, variableType) {
  var RED = this.RED;
  var found = _.find(RED.nodes.getFlows(), function (node) {
    return node.type == variableType && node.variable == variable;
  });

  if (found) return RED.nodes.getNode(found.id);
  return null;
};

function addChildrenWiresToMap(nodes, node, map) {
  var positiveWires = node.wires[0] || [];
  var negativeWires = node.wires[1] || [];

  nodes.nodesInfo[node.id] = {
    positiveWires: positiveWires.length,
    negativeWires: negativeWires.length
  };

  map[node.id] = {
    positive: positiveWires,
    negative: negativeWires
  };

  positiveWires.concat(negativeWires).forEach(function (childId) {
    var child = nodes.RED.nodes.getNode(childId);
    addChildrenWiresToMap(nodes, child, map);
  });

  return map;
}

function initializeForwardLinks(nodes) {
  var links = {};
  nodes.startNodes().forEach(function (node) {
    addChildrenWiresToMap(nodes, node, links);
  });
  nodes.functionNodes().forEach(function (node) {
    addChildrenWiresToMap(nodes, node, links);
  });

  nodes.forwardLinks = links;
}

function initializeBackwardLinks(nodes) {
  var links = {};

  _.each(nodes.forwardLinks, function (allTo, from) {
    allTo.positive.concat(allTo.negative).forEach(function (to) {
      if (links[to])
        links[to].push(from);
      else
        links[to] = [from];
    });
  });

  nodes.backwardLinks = links;
}

module.exports = Nodes;
