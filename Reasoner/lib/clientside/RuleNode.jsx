var React = require('react'),
    BlocklyContainer = require('./BlocklyContainer.jsx'),

    blocks = require('./blocks'),
    IfForNumericServiceBlock = blocks.IfForNumericServiceBlock,
    IfForBooleanServiceBlock = blocks.IfForBooleanServiceBlock,
    IfForEventServiceBlock = blocks.IfForEventServiceBlock,
    ThenForNumericServiceBlock = blocks.ThenForNumericServiceBlock,
    ThenForBooleanServiceBlock = blocks.ThenForBooleanServiceBlock,
    ThenForTriggerServiceBlock = blocks.ThenForTriggerServiceBlock;

var RuleNode = React.createClass({

  render: function () {
    return (
      <BlocklyContainer blocklyData={this.props.blocklyData}>
        <IfForNumericServiceBlock />
        <IfForEventServiceBlock />
        <IfForBooleanServiceBlock />
        <ThenForNumericServiceBlock />
        <ThenForBooleanServiceBlock />
        <ThenForTriggerServiceBlock />
      </BlocklyContainer>
    );
  }

});

module.exports = RuleNode;
