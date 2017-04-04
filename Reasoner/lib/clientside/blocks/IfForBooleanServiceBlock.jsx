var React = require('react'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    findVariables = require('../findVariables'),
    Blockly = require('../Blockly');

var IfForBooleanServiceBlock = React.createClass({

  componentDidMount: function () {
    var providers = listToBlocklyOptions(findVariables('DataProvider'));

    if (providers.length) {
      Blockly.Blocks['if_for_boolean_service'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('IF')
            .appendField(new Blockly.FieldDropdown(providers), 'service')
            .appendField('is turned')
            .appendField(new Blockly.FieldDropdown([['On', '1'], ['Off', '0']]), 'value');
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
    if (findVariables('DataProvider').length == 0) return null;
    return (
      <block type='if_for_boolean_service'></block>
    );
  }

});

module.exports = IfForBooleanServiceBlock;
