var React = require('react'),
    Blockly = require('../Blockly');

var PropertyTypeSelectParameterOptionBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['property_type_select_parameter_option'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Option')
          .appendField(new Blockly.FieldTextInput(''), 'option');
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
      <block type="property_type_select_parameter_option"></block>
    );
  }

});

module.exports = PropertyTypeSelectParameterOptionBlock;
