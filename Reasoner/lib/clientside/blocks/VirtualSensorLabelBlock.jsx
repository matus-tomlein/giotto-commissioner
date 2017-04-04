var React = require('react'),
    Blockly = require('../Blockly');

var VirtualSensorLabelBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['virtual_sensor_label'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Label')
          .appendField(new Blockly.FieldTextInput(''), 'label');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="virtual_sensor_label"></block>
    );
  }

});

module.exports = VirtualSensorLabelBlock;
