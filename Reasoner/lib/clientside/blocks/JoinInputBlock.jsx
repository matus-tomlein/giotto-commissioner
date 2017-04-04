var React = require('react'),
    Blockly = require('../Blockly');

var JoinInputBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['join_input'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Join')
          .appendField(new Blockly.FieldVariable('A'), 'id');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(190);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="join_input"></block>
    );
  }

});

module.exports = JoinInputBlock;
