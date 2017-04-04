var React = require('react'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    findVariables = require('../findVariables'),
    Blockly = require('../Blockly');

var IfForEventServiceBlock = React.createClass({

  componentDidMount: function () {
    var providers = listToBlocklyOptions(findVariables('VirtualSensor'));
    var labels = listToBlocklyOptions(findVariables('VirtualSensorLabel'));

    if (providers.length && labels.length) {
      Blockly.Blocks['if_for_event_service'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('WHEN')
            .appendField(new Blockly.FieldDropdown(providers), 'service')
            .appendField('becomes')
            .appendField(new Blockly.FieldDropdown(labels), 'value');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(330);
          this.setTooltip('');
          this.setHelpUrl('http://www.example.com/');
        }
      };
    }
  },

  render: function () {
    if (findVariables('VirtualSensor').length == 0 ||
      findVariables('VirtualSensorLabel').length == 0) return null;
    return (
      <block type='if_for_event_service'></block>
    );
  }

});

module.exports = IfForEventServiceBlock;
