var React = require('react'),
    BlocklyContainer = require('./BlocklyContainer.jsx'),

    blocks = require('./blocks'),
    LocationTypeBlock = blocks.LocationTypeBlock,
    FlowTypeBlock = blocks.FlowTypeBlock,
    PropertyTypeBlock = blocks.PropertyTypeBlock,
    PropertyTypeParameterBlock = blocks.PropertyTypeParameterBlock,
    PropertyTypeSelectParameterBlock = blocks.PropertyTypeSelectParameterBlock,
    PropertyTypeSelectParameterOptionBlock = blocks.PropertyTypeSelectParameterOptionBlock;

var DefinitionNode = React.createClass({

  render: function () {
    return (
      <BlocklyContainer blocklyData={this.props.blocklyData}>
        <LocationTypeBlock />
        <FlowTypeBlock />
        <PropertyTypeBlock />
        <PropertyTypeParameterBlock />
        <PropertyTypeSelectParameterBlock />
        <PropertyTypeSelectParameterOptionBlock />
      </BlocklyContainer>
    );
  }

});

module.exports = DefinitionNode;
