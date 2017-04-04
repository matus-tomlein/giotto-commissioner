var React = require('react'),
    findVariables = require('../findVariables'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    Blockly = require('../Blockly');

var FlowGroupBlock = React.createClass({

  flowTypes: function () {
    return listToBlocklyOptions(findVariables('Flow type'));
  },

  componentDidMount: function () {
    var flowTypes = this.flowTypes();

    if (flowTypes.length > 0) {
      Blockly.Blocks['flow_group'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('A water tank containing:');
          this.appendStatementInput('flow_placements')
            .setCheck(null);
          this.setPreviousStatement(true, 'in_flow');
          this.setNextStatement(true, 'in_flow');
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
      <block type="flow_group"></block>
    );
  }

});

module.exports = FlowGroupBlock;
