var React = require('react'),
    Blockly = require('../Blockly');

var LocationTypeBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['location_type'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Location type');
        this.appendDummyInput()
          .appendField('Name')
          .appendField(new Blockly.FieldTextInput('Room'), 'name');
        this.setColour(80);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="location_type"></block>
    );
  }

});

module.exports = LocationTypeBlock;
