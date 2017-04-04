var React = require('react'),
    BlocklyContainer = require('./BlocklyContainer.jsx'),

    blocks = require('./blocks'),
    PropertyBlock = blocks.PropertyBlock,

    blockSettings = require('./blockSettings');

var PropertyNode = React.createClass({

  getInitialState: function () {
    return { initialized: false };
  },

  componentDidMount: function () {
    var that = this;
    blockSettings.loadPropertyTypes(function () {
      that.setState({ initialized: true });
    });
  },

  render: function () {
    if (!this.state.initialized) return <div />;

    var addAnyOption = this.props.addAnyOption;

    var blocks = blockSettings.propertyTypes.map(function (propertyType) {
      return <PropertyBlock {...propertyType} addAnyOption={addAnyOption} />;
    });

    return (
      <BlocklyContainer blocklyData={this.props.blocklyData}>
        {blocks}
      </BlocklyContainer>
    );
  }

});

module.exports = PropertyNode;
