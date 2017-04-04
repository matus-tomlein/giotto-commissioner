var CaseReasoner = require('../index'),
    Variables = require('./Variables'),
    vocab = CaseReasoner.vocabulary,
    hashString = require('./hashString'),
    N3 = require('n3'),
    N3Util = N3.Util;

function Property(id) {
  this.propertyTypeUri = null;
  this.parameters = [];
  if (id)
    this.variableName = '?property_' + hashString(id);
}

Property.prototype.precondition = function (nodes, ancestors) {
  var that = this;

  if (this.propertyTypeUri) {
    var items = [
      [this.variableName, vocab.rdf('type'), vocab.case('Property')],
      [this.variableName, vocab.case('propertyType'), this.propertyTypeUri]
    ];

    this.parameterBlanks(nodes, ancestors).forEach(function (parameter) {
      items.push([ that.variableName, vocab.case('parameter'), parameter ]);
    });

    return items;
  }
  return [];
};

Property.prototype.assigned = function (nodes, ancestors) {
  return this.inferWithType('Property', nodes, ancestors);
};

Property.prototype.recommended = function (nodes, ancestors) {
  return this.inferWithType('RecommendedProperty', nodes, ancestors);
};

Property.prototype.inferWithType = function (type, nodes, ancestors) {
  if (this.propertyTypeUri) {
    var items = [
        {
          predicate: vocab.rdf('type'),
          object: vocab.case(type)
        },
        {
          predicate: vocab.case('propertyType'),
          object: this.propertyTypeUri
        }
    ];

    this.parameterBlanks(nodes, ancestors).forEach(function (parameter) {
      items.push({
        predicate: vocab.case('parameter'),
        object: parameter
      });
    });

    ancestors.forEach(function (ancestor) {
      if (ancestor.variables && ancestor.variables['Property']) {
        var variables = ancestor.variables['Property'];

        for (var key in variables) {
          var obj = variables[key];

          items.push({
            predicate: vocab.case('ancestor'),
            object: obj.variableName
          });
        }
      }
    });

    var writer = N3.Writer();
    return [
      [ vocab.case('Reasoning'), vocab.case('uncovered'), writer.blank(items) ]
    ];
  }

  return [];
};

Property.prototype.parameterBlanks = function (nodes, ancestors) {
  var items = [];
  var writer = N3.Writer();

  var vars = new Variables(nodes, ancestors);
  this.parameters.forEach(function (parameter) {
    if (!parameter.value) return;
    var value = null;

    if (parameter.accepts == 'Text' || parameter.accepts == 'Select') {
      value = N3Util.createLiteral(parameter.value);
    } else if (parameter.accepts == '__variableName') {
      value = parameter.value;
    } else {
      var refered = vars.getVariable(parameter.value, parameter.accepts);
      if (refered)
        value = refered.variableName;
    }

    if (value) {
      items.push(writer.blank([
        {
          predicate: vocab.rdf('type'),
          object: vocab.case('PropertyParameter')
        },
        {
          predicate: vocab.case('parameterType'),
          object: parameter.uri
        },
        {
          predicate: vocab.case('value'),
          object: value
        }
      ]));
    }
  });

  return items;
};

module.exports = Property;
