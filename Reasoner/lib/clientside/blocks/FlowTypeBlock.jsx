var React = require('react'),
    Blockly = require('../Blockly');

var FlowTypeBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['flow_type'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Flow type');
        this.appendDummyInput()
          .appendField('Name')
          .appendField(new Blockly.FieldTextInput('Flow'), 'name');
        this.appendDummyInput()
          .appendField('Description')
          .appendField(new Blockly.FieldTextInput(''), 'description');
        this.setColour(190);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="flow_type"></block>
    );
  }

});

module.exports = FlowTypeBlock;
