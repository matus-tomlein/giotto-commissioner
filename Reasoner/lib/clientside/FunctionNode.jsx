var React = require('react'),
    BlocklyContainer = require('./BlocklyContainer.jsx'),

    blocks = require('./blocks'),
    FunctionAttributeBlock = blocks.FunctionAttributeBlock;

var FunctionNode = React.createClass({

  render: function () {
    return (
      <BlocklyContainer blocklyData={this.props.blocklyData}>
        <FunctionAttributeBlock />
      </BlocklyContainer>
    );
  }

});

module.exports = FunctionNode;
