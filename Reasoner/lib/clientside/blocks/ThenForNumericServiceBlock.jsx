var React = require('react'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    findVariables = require('../findVariables'),
    Blockly = require('../Blockly');

var ThenForNumericServiceBlock = React.createClass({

  componentDidMount: function () {
    var consumers = listToBlocklyOptions(findVariables('DataConsumer'));

    Blockly.Blocks['then_for_numeric_service'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('THEN set')
          .appendField(new Blockly.FieldDropdown(consumers), 'service');
        this.appendDummyInput()
          .appendField('to')
          .appendField(new Blockly.FieldTextInput(''), 'value');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type='then_for_numeric_service'></block>
    );
  }

});

module.exports = ThenForNumericServiceBlock;
