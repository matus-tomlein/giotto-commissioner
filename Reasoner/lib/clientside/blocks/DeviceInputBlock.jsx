var React = require('react'),
    findVariables = require('../findVariables'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    Blockly = require('../Blockly');

var DeviceInputBlock = React.createClass({

  devices: function () {
    return listToBlocklyOptions(findVariables('Device'));
  },

  componentDidMount: function () {
    var devices = this.devices();

    if (devices.length > 0) {
      Blockly.Blocks['device_input'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('Device')
            .appendField(new Blockly.FieldDropdown(devices), 'device');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(210);
          this.setTooltip('');
          this.setHelpUrl('http://www.example.com/');
        }
      };
    }
  },

  render: function () {
    if (this.devices().length == 0) return null;

    return (
      <block type="device_input"></block>
    );
  }

});

module.exports = DeviceInputBlock;
