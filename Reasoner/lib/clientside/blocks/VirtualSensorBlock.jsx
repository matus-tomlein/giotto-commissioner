var React = require('react'),
    Blockly = require('../Blockly');

var VirtualSensorBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['virtual_sensor'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Virtual sensor');
        this.appendDummyInput()
          .appendField('Label')
          .appendField(new Blockly.FieldTextInput(''), 'label');
        this.appendStatementInput('inputs')
          .setCheck(null)
          .appendField('Sensor inputs');
        this.appendStatementInput('labels')
          .setCheck(null)
          .appendField('Labels');
        this.setColour(210);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="virtual_sensor"></block>
    );
  }

});

module.exports = VirtualSensorBlock;
