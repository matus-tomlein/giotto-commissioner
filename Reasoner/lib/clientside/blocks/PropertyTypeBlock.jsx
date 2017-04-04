var React = require('react'),
    Blockly = require('../Blockly');

var PropertyTypeBlock = React.createClass({

  componentDidMount: function () {
    var kinds = [['Application', 'application'],
                ['Networking', 'networking'],
                ['Assigned', 'inferred'],
                ['Requirement', 'requirement']];

    Blockly.Blocks['property_type'] = {
      init: function() {
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(kinds), 'kind');
        this.appendDummyInput()
          .appendField('Name')
          .appendField(new Blockly.FieldTextInput(''), 'name');
        this.appendStatementInput('parameters')
          .setCheck(null)
          .appendField('Parameters');
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="property_type"></block>
    );
  }

});

module.exports = PropertyTypeBlock;
