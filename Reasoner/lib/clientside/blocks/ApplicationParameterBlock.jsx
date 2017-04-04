var React = require('react'),
    propertyParameterAcceptTypes = require('./propertyParameterAcceptTypes'),
    Blockly = require('../Blockly');

var ApplicationParameterBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['application_parameter'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Parameter');
        this.appendDummyInput()
          .appendField('Name')
          .appendField(new Blockly.FieldTextInput(''), 'name');
        this.appendDummyInput()
          .appendField('Accepts')
          .appendField(new Blockly.FieldDropdown(propertyParameterAcceptTypes()), 'accepts');
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="application_parameter"></block>
    );
  }

});

module.exports = ApplicationParameterBlock;
