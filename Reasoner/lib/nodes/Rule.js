var CaseReasoner = require('../index'),
    Variables = require('./Variables'),
    N3 = require('n3'),
    N3Util = N3.Util,
    vocab = CaseReasoner.vocabulary;

function Rule() {
  this.id = Math.random().toString(36).substring(7);
  this.variableName = '?rule_' + this.id;
  this.label = '';
  this.ruleItems = [];
}

Rule.prototype.assigned = function (nodes, ancestors) {
  var items = [
      {
        predicate: vocab.rdf('type'),
        object: vocab.case('Rule')
      },
      {
        predicate: vocab.case('label'),
        object: N3Util.createLiteral(this.label)
      }
  ];

  var vars = new Variables(nodes, ancestors);
  var writer = N3.Writer();
  var ruleItems = this.ruleItems.map(function (item) {
    var blankItems = [
        {
          predicate: vocab.rdf('type'),
          object: vocab.case('RuleItem')
        }
    ];

    if (item.virtualSensor) {
      var virtualSensor = vars.getVariable(item.virtualSensor, 'VirtualSensor');

      blankItems.push({
        predicate: vocab.case('virtualSensor'),
        object: virtualSensor.variableName
      });
    } else {
      var service;
      if (item.consumer)
        service = vars.getVariable(item.consumer, 'DataConsumer');
      if (item.provider)
        service = vars.getVariable(item.provider, 'DataProvider');

      if (!service) {
        console.error('Failed to find service ' + item.consumer + item.provider);
        return;
      }

      blankItems.push({
        predicate: vocab.case('service'),
        object: service.variableName
      });
    }

    if (item.value != undefined) {
      blankItems.push({
        predicate: vocab.case('value'),
        object: N3Util.createLiteral(item.value)
      });
    }
    if (item.operator) {
      blankItems.push({
        predicate: vocab.case('operator'),
        object: N3Util.createLiteral(item.operator)
      });
    }

    return writer.blank(blankItems);
  });

  ancestors.forEach(function (ancestor) {
    if (ancestor.variables && ancestor.variables['Property']) {
      var variables = ancestor.variables['Property'];

      for (var key in variables) {
        var obj = variables[key];
        items.push({
          predicate: vocab.case('property'),
          object: obj.variableName
        });
      }
    }
  });

  items.push({
    predicate: vocab.case('items'),
    object: writer.list(ruleItems)
  });

  return [
    [ vocab.case('Reasoning'), vocab.case('uncovered'), writer.blank(items) ]
  ];
};

module.exports = Rule;
