var React = require('react'),
    BlocklyContainer = require('./BlocklyContainer.jsx'),

    blocks = require('./blocks'),
    DeviceBlock = blocks.DeviceBlock,
    ResourceBlock = blocks.ResourceBlock,
    CharacteristicBlock = blocks.CharacteristicBlock,

    blockSettings = require('./blockSettings');

var DevicesNode = React.createClass({

  getInitialState: function () {
    return { initialized: false };
  },

  componentDidMount: function () {
    var that = this;
    blockSettings.loadCharacteristics('device', function () {
      that.setState({ initialized: true });
    });
  },

  render: function () {
    if (!this.state.initialized) return <div />;

    var chars = blockSettings.characteristics.map(function (characteristic) {
      return <CharacteristicBlock {...characteristic} />;
    });

    return (
      <BlocklyContainer blocklyData={this.props.blocklyData}>
        <DeviceBlock />
        <ResourceBlock />
        {chars}
      </BlocklyContainer>
    );
  }

});

module.exports = DevicesNode;
