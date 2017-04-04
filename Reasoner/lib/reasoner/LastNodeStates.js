var N3 = require('n3'),
    vocab = require('./vocabulary');

var LastNodeStates = function () {
  this.nodes = {};
};

LastNodeStates.prototype.processReasoningOutput = function (output, callback) {
  var that = this;
  this.nodes = {};
  var parser = N3.Parser();

  parser.parse(output,
      function (error, triple) {
        if (triple) {
          if (triple.predicate == vocab.case('considered')) {
            that.nodeConsidered(triple.subject);
          }
          else if (triple.predicate == vocab.case('passed')) {
            that.nodePassed(triple.subject);
          }
          else if (triple.predicate == vocab.case('hasAlternative')) {
            that.nodeHasAlternative(triple.subject);
          }
          else if (triple.predicate == vocab.case('onAlternative')) {
            that.nodeOnAlternative(triple.subject);
          }
        } else {
          callback(null);
        }
      });
};

LastNodeStates.prototype.nodeOnAlternative = function (uri) {
  if (this.nodes[uri])
    this.nodes[uri].onAlternative = true;
  else
    this.nodes[uri] = { onAlternative: true };
};

LastNodeStates.prototype.nodeHasAlternative = function (uri) {
  if (this.nodes[uri])
    this.nodes[uri].hasAlternative = true;
  else
    this.nodes[uri] = { hasAlternative: true };
};

LastNodeStates.prototype.nodePassed = function (uri) {
  if (this.nodes[uri])
    this.nodes[uri].passed = true;
  else
    this.nodes[uri] = { passed: true };
};

LastNodeStates.prototype.nodeConsidered = function (uri) {
  if (this.nodes[uri])
    this.nodes[uri].considered = true;
  else
    this.nodes[uri] = { considered: true };
};

LastNodeStates.prototype.shouldUsePositiveLinks = function (node) {
  var uri = vocab.nodeUri(node);
  if (!this.nodes[uri]) return true;

  return this.nodes[uri].passed ||
    !this.nodes[uri].hasAlternative;
};

LastNodeStates.prototype.shouldIterateAgain = function () {
  for (var uri in this.nodes) {
    if (this.nodes[uri].hasAlternative &&
        !this.nodes[uri].onAlternative &&
        !this.nodes[uri].passed)
      return true;
  }
  return false;
};

module.exports = LastNodeStates;
