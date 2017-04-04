var React = require('react'),
    BlocklyContainer = require('./BlocklyContainer.jsx'),

    blocks = require('./blocks'),
    ApplicationTagBlock = blocks.ApplicationTagBlock,
    ApplicationParameterBlock = blocks.ApplicationParameterBlock;

var ApplicationNode = React.createClass({

  render: function () {
    return (
      <BlocklyContainer blocklyData={this.props.blocklyData}>
        <ApplicationParameterBlock />
        <ApplicationTagBlock />
      </BlocklyContainer>
    );
  }

});

module.exports = ApplicationNode;
