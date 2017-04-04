var React = require('react'),
    BlocklyContainer = require('./BlocklyContainer.jsx'),

    blocks = require('./blocks'),
    CharacteristicBlock = blocks.CharacteristicBlock,
    DataProviderBlock = blocks.DataProviderBlock,
    DataConsumerBlock = blocks.DataConsumerBlock,

    blockSettings = require('./blockSettings');

var ServicesNode = React.createClass({

  getInitialState: function () {
    return { initialized: false };
  },

  componentDidMount: function () {
    var that = this;
    blockSettings.loadCharacteristics('service', function () {
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
        <DataProviderBlock />
        <DataConsumerBlock />
        {chars}
      </BlocklyContainer>
    );
  }

});

module.exports = ServicesNode;
