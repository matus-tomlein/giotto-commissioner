var CaseReasoner = require('../index'),
    hashString = require('./hashString'),
    N3 = require('n3'),
    N3Util = N3.Util,
    vocab = CaseReasoner.vocabulary;

class PropertyType {
  constructor(name) {
    this.name = name;
    this.nodeId = hashString(name);
    this.uri = vocab.case('property_type_' + this.nodeId);
    this.kind = '';
    this.parameters = [];
    this.tags = [];
  }

  parameterUri(parameterName) {
    return vocab.case('param_' + hashString(this.name + '_' + parameterName));
  }

  ontology() {
    var items = [
      [ this.uri, vocab.rdf('type'), vocab.case('PropertyType') ],
      [ this.uri, vocab.case('title'), N3Util.createLiteral(this.name) ],
      [ this.uri, vocab.case('kind'), N3Util.createLiteral(this.kind) ]
    ];

    var that = this;
    if (this.tags) {
      this.tags.forEach((tag) => {
        items.push([ that.uri, vocab.case('tag'), N3Util.createLiteral(tag) ]);
      });
    }

    this.parameters.forEach((param) => {
      var parameterUri = that.parameterUri(param.name);
      items.push([ that.uri, vocab.case('parameter'), parameterUri ]);
      items.push([ parameterUri, vocab.rdf('type'), vocab.case('PropertyTypeParameter') ]);
      items.push([ parameterUri, vocab.case('name'), N3Util.createLiteral(param.name) ]);
      items.push([ parameterUri, vocab.case('accepts'), N3Util.createLiteral(param.accepts) ]);

      if (param.options) {
        param.options.forEach((option) => {
          items.push([ parameterUri, vocab.case('option'), N3Util.createLiteral(option) ]);
        });
      }
    });

    return items;
  }
}

module.exports = PropertyType;
