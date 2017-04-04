var React = require('react'),
    Blockly = require('../Blockly');

var ExternalInputBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['external_input'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('System')
          .appendField(new Blockly.FieldVariable('External system'), 'external');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(260);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="external_input"></block>
    );
  }

});

module.exports = ExternalInputBlock;
