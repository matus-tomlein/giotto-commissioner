var React = require('react'),
    BlocklyContainer = require('./BlocklyContainer.jsx'),

    blocks = require('./blocks'),
    VirtualSensorBlock = blocks.VirtualSensorBlock,
    DataProviderInputBlock = blocks.DataProviderInputBlock,
    VirtualSensorLabelBlock = blocks.VirtualSensorLabelBlock;

var RuleNode = React.createClass({

  render: function () {
    return (
      <BlocklyContainer blocklyData={this.props.blocklyData}>
        <VirtualSensorBlock />
        <DataProviderInputBlock />
        <VirtualSensorLabelBlock />
      </BlocklyContainer>
    );
  }

});

module.exports = RuleNode;
