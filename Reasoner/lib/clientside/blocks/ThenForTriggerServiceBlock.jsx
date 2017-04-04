var React = require('react'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    findVariables = require('../findVariables'),
    Blockly = require('../Blockly');

var ThenForTriggerServiceBlock = React.createClass({

  componentDidMount: function () {
    var consumers = listToBlocklyOptions(findVariables('DataConsumer'));

    if (consumers.length) {
      Blockly.Blocks['then_for_trigger_service'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('THEN trigger')
            .appendField(new Blockly.FieldDropdown(consumers), 'service');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(120);
          this.setTooltip('');
          this.setHelpUrl('http://www.example.com/');
        }
      };
    }
  },

  render: function () {
    return (
      <block type='then_for_trigger_service'></block>
    );
  }

});

module.exports = ThenForTriggerServiceBlock;
