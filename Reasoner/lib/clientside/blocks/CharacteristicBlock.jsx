var React = require('react'),
    Blockly = require('../Blockly');

var CharacteristicBlock = React.createClass({

  componentDidMount: function () {
    var props = this.props;

    Blockly.Blocks[props.blockName] = {
      init: function() {
        var input = this.appendDummyInput()
          .appendField(props.description);
        if (props.valueType == 'select') {
          var options = props.options.map(function (option) {
            return [option, option];
          });
          input.appendField(new Blockly.FieldDropdown(options), 'value');
        }

        this.setColour(80);
        this.setTooltip('');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type={this.props.blockName}></block>
    );
  }

});

module.exports = CharacteristicBlock;
