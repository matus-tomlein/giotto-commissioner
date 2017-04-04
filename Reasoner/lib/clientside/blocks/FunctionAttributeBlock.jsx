var React = require('react'),
    Blockly = require('../Blockly');

var FunctionAttributeBlock = React.createClass({

  componentDidMount: function () {
    var types = [
      ['Device', 'Device'],
      ['Resource', 'Resource'],
      ['Location', 'Location']
    ];

    Blockly.Blocks['function_attribute'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Accept attribute');
        this.appendDummyInput()
          .appendField('With type')
          .appendField(new Blockly.FieldDropdown(types), 'type');
        this.appendDummyInput()
          .appendField('As')
          .appendField(new Blockly.FieldTextInput('Attribute'), 'name');

        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="function_attribute"></block>
    );
  }

});

module.exports = FunctionAttributeBlock;
