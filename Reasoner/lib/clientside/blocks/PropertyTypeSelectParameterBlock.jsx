var React = require('react'),
    Blockly = require('../Blockly');

var PropertyTypeSelectParameterBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['property_type_select_parameter'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Property parameter');
        this.appendDummyInput()
          .appendField('Name')
          .appendField(new Blockly.FieldTextInput(''), 'name');
        this.appendStatementInput('options')
          .setCheck(null)
          .appendField('Options');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="property_type_select_parameter"></block>
    );
  }

});

module.exports = PropertyTypeSelectParameterBlock;
