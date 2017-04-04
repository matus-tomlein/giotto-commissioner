var React = require('react'),
    Blockly = require('../Blockly');

var ResourceBlock = React.createClass({

  componentDidMount: function () {
    Blockly.Blocks['resource'] = {
      init: function() {
        this.appendDummyInput()
          .appendField('Resource');
        this.appendDummyInput()
          .appendField('Label')
          .appendField(new Blockly.FieldTextInput('Resource'), 'label');
        this.setColour(60);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type="resource"></block>
    );
  }

});

module.exports = ResourceBlock;
