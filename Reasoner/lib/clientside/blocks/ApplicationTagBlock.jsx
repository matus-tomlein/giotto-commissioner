var React = require('react'),
    Blockly = require('../Blockly');

var ApplicationTagBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['application_tag'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Tag')
          .appendField(new Blockly.FieldTextInput(''), 'tag');
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="application_tag"></block>
    );
  }

});

module.exports = ApplicationTagBlock;
