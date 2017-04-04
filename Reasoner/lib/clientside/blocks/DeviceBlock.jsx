var React = require('react'),
    Blockly = require('../Blockly');

var DeviceBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['device'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Device');
        this.appendDummyInput()
          .appendField('Label')
          .appendField(new Blockly.FieldTextInput('Device'), 'label');
        this.appendStatementInput('characteristics')
          .setCheck(null)
          .appendField('That');
        this.setColour(210);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="device"></block>
    );
  }

});

module.exports = DeviceBlock;
