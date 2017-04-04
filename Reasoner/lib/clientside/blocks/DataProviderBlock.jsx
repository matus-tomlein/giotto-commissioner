var React = require('react'),
    findVariables = require('../findVariables'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    Blockly = require('../Blockly');

var DataProviderBlock = React.createClass({

  devices: function () {
    return [['Any', '']].concat(listToBlocklyOptions(findVariables('Device')));
  },

  componentDidMount: function () {
    var devices = this.devices();

    if (devices.length > 0) {
      Blockly.Blocks['data_provider'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('Sensor');

          this.appendDummyInput()
            .appendField('Label')
            .appendField(new Blockly.FieldTextInput('Temperature'), 'label');

          this.appendDummyInput()
            .appendField('Device')
            .appendField(new Blockly.FieldDropdown(devices), 'device');

          this.appendStatementInput('characteristics')
            .setCheck(null)
            .appendField('That');

          this.setColour(160);
          this.setTooltip('');
          this.setHelpUrl('http://www.example.com/');
        }
      };
    }
  },

  render: function () {
    if (this.devices().length == 0) return null;

    return (
      <block type="data_provider"></block>
    );
  }

});

module.exports = DataProviderBlock;
