var React = require('react'),
    BlocklyContainer = require('./BlocklyContainer.jsx'),

    blocks = require('./blocks'),
    LocationBlock = blocks.LocationBlock,
    FlowBlock = blocks.FlowBlock,
    FlowGroupBlock = blocks.FlowGroupBlock,
    DeviceInputBlock = blocks.DeviceInputBlock,
    ResourceInputBlock = blocks.ResourceInputBlock,
    JoinInputBlock = blocks.JoinInputBlock,
    ExternalInputBlock = blocks.ExternalInputBlock;

var LayoutNode = React.createClass({

  render: function () {
    return (
      <BlocklyContainer blocklyData={this.props.blocklyData}>
        <LocationBlock />
        <FlowBlock />
        <FlowGroupBlock />
        <DeviceInputBlock />
        <ResourceInputBlock />
        <JoinInputBlock />
        <ExternalInputBlock />
      </BlocklyContainer>
    );
  }

});

module.exports = LayoutNode;
