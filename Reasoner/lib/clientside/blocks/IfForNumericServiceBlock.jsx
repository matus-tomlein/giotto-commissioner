var React = require('react'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    findVariables = require('../findVariables'),
    Blockly = require('../Blockly');

var IfForNumericServiceBlock = React.createClass({

  componentDidMount: function () {
    var operators = [
      ['=', 'EQ'],
      ['\u2260', 'NEQ'],
      ['<', 'LT'],
      ['\u2264', 'LTE'],
      ['>', 'GT'],
      ['\u2265', 'GTE']
    ];

    var providers = listToBlocklyOptions(findVariables('DataProvider'));

    if (providers.length) {
      Blockly.Blocks['if_for_numeric_service'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('IF')
            .appendField(new Blockly.FieldDropdown(providers), 'service')
            .appendField(new Blockly.FieldDropdown(operators), 'operator')
            .appendField(new Blockly.FieldTextInput(''), 'value');
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
      <block type='if_for_numeric_service'></block>
    );
  }

});

module.exports = IfForNumericServiceBlock;
