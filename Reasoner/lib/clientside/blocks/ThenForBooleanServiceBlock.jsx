var React = require('react'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    findVariables = require('../findVariables'),
    Blockly = require('../Blockly');

var ThenForBooleanServiceBlock = React.createClass({

  componentDidMount: function () {
    var consumers = listToBlocklyOptions(findVariables('DataConsumer'));

    if (consumers.length) {
      Blockly.Blocks['then_for_boolean_service'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('THEN turn')
            .appendField(new Blockly.FieldDropdown(consumers), 'service')
            .appendField(new Blockly.FieldDropdown([['On', '1'], ['Off', '0']]), 'value');
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
    if (findVariables('DataConsumer').length == 0) return null;
    return (
      <block type='then_for_boolean_service'></block>
    );
  }

});

module.exports = ThenForBooleanServiceBlock;
