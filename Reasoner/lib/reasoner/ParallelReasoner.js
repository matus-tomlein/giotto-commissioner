var Reasoner = require('./Reasoner'),
    _ = require('underscore'),
    TriplesProcessor = require('./TriplesProcessor'),
    RuleSerializer = require('./RuleSerializer'),
    SemanticRule = require('./SemanticRule'),
    RuleReasoningOrder = require('./RuleReasoningOrder');

class ParallelReasoner {
  constructor(sources, nodes) {
    this.sources = sources;
    this.nodes = nodes;
    this.processedTriples = [];
  }

  reason(callback) {
    var that = this;

    var serializer = new RuleSerializer(this.nodes);
    var rules = serializer.getRules();
    var order = new RuleReasoningOrder(rules);

    this.reasonWithRulesOrder(order, function (err) {
      if (err) {
        callback(err);
      } else {
        that.processedTriplesToN3(callback);
      }
    });
  }

  reasonWithRulesOrder(order, callback) {
    var that = this;

    if (order.cancelled) return;

    var nextRulesToReason = order.getNextRulesToReason();
    if (nextRulesToReason.length > 0) {
      nextRulesToReason.forEach(function (rule) {
        that.reasonAboutRule(order, rule, callback);
      });
    } else {
      if (order.allRulesProcessed()) {
        callback(null);
      }
    }
  }

  reasonAboutRule(order, rule, callback) {
    var that = this;

    rulesToN3([rule], [], function (err, ruleN3) {
      if (err) {
        order.cancelled = true;
        callback(err);
        return;
      }

      that.processedTriplesToN3(function (err, tempOutputN3) {
        if (err) {
          order.cancelled = true;
          callback(err);
          return;
        }

        var reasonerInput = ruleN3;
        if (tempOutputN3) reasonerInput.push(tempOutputN3);

        reasonerInput = [].concat(that.sources).concat(reasonerInput);

        var startedAt = new Date().getTime();
        var reasoner = new Reasoner();
        reasoner.reason(reasonerInput,
            function (err, output) {
              var finishedAt = new Date().getTime();
              console.log(startedAt, finishedAt);

              if (err) {
                order.cancelled = true;
                callback(err);
                return;
              }

              that.parseAndAddToProcessedTriples(output, function (err) {
                if (err) {
                  order.cancelled = true;
                  callback(err);
                  return;
                }

                order.ruleProcessingFinished(rule);
                that.reasonWithRulesOrder(order, callback);
              });
            });
      });
    });
  }

  parseAndAddToProcessedTriples(output, callback) {
    var that = this;
    var triplesProcessor = new TriplesProcessor();

    triplesProcessor.fromDefinition(output, function (err) {
      if (err) {
        callback(err);
      } else {
        triplesProcessor.convertToNamedNodes();
        var triples = triplesProcessor.toArrayFormat();

        var joined = triples.concat(that.processedTriples);
        that.processedTriples = _.uniq(joined, false, function (t) { return t.join(' '); });

        callback(null);
      }
    });
  }

  processedTriplesToN3(callback) {
    var rule = new SemanticRule();
    rule.postcondition = this.processedTriples;
    rule.toN3(callback);
  }
}

function rulesToN3(rules, n3, callback) {
  var rule = rules.pop();

  if (rule) {
    rule.toN3(function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        n3.push(result);
        rulesToN3(rules, n3, callback);
      }
    });
  } else {
    callback(null, n3);
  }
}

module.exports = ParallelReasoner;
