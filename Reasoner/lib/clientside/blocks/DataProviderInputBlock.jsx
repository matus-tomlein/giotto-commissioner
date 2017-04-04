var React = require('react'),
    findVariables = require('../findVariables'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    Blockly = require('../Blockly');

var DataProviderInputBlock = React.createClass({

  devices: function () {
    return listToBlocklyOptions(findVariables('DataProvider'));
  },

  componentDidMount: function () {
    var devices = this.devices();

    if (devices.length > 0) {
      Blockly.Blocks['data_provider_input'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('Sensor')
            .appendField(new Blockly.FieldDropdown(devices), 'data_provider');
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
      <block type="data_provider_input"></block>
    );
  }

});

module.exports = DataProviderInputBlock;
