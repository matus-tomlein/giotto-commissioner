var React = require('react'),
    findVariables = require('../findVariables'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    Blockly = require('../Blockly');

var ResourceInputBlock = React.createClass({

  resources: function () {
    return listToBlocklyOptions(findVariables('Resource'));
  },

  componentDidMount: function () {
    var resources = this.resources();

    if (resources.length > 0) {
      Blockly.Blocks['resource_input'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('Resource')
            .appendField(new Blockly.FieldDropdown(resources), 'resource');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(60);
          this.setTooltip('');
          this.setHelpUrl('http://www.example.com/');
        }
      };
    }
  },

  render: function () {
    if (this.resources().length == 0) return null;

    return (
      <block type="resource_input"></block>
    );
  }

});

module.exports = ResourceInputBlock;
