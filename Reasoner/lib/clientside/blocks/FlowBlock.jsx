var React = require('react'),
    findVariables = require('../findVariables'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    Blockly = require('../Blockly');

var FlowBlock = React.createClass({

  flowTypes: function () {
    return listToBlocklyOptions(findVariables('Flow type'));
  },

  componentDidMount: function () {
    var flowTypes = this.flowTypes();

    if (flowTypes.length > 0) {
      Blockly.Blocks['flow'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('Flow')
            .appendField(new Blockly.FieldDropdown(flowTypes), 'type');
          this.appendStatementInput('flow_items')
            .setCheck('in_flow')
            .appendField('Passes:');
          this.setInputsInline(false);
          this.setColour(190);
          this.setTooltip('');
          this.setHelpUrl('http://www.example.com/');
        }
      };
    }
  },

  render: function () {
    if (this.flowTypes().length == 0) return null;

    return (
      <block type="flow"></block>
    );
  }

});

module.exports = FlowBlock;
