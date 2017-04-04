var React = require('react'),
    api = require('./externalApi'),

    SaveDevicesNode = require('./saving/SaveDevicesNode'),
    SaveServicesNode = require('./saving/SaveServicesNode'),
    SavePropertyNode = require('./saving/SavePropertyNode'),
    SaveLayoutNode = require('./saving/SaveLayoutNode'),
    SaveDefinitionNode = require('./saving/SaveDefinitionNode'),
    SaveFunctionNode = require('./saving/SaveFunctionNode'),
    SaveRuleNode = require('./saving/SaveRuleNode'),
    SaveApplicationNode = require('./saving/SaveApplicationNode'),
    SaveVirtualSensorsNode = require('./saving/SaveVirtualSensorsNode'),

    DevicesNode = require('./DevicesNode.jsx'),
    ServicesNode = require('./ServicesNode.jsx'),
    PropertyNode = require('./PropertyNode.jsx'),
    LayoutNode = require('./LayoutNode.jsx'),
    DefinitionNode = require('./DefinitionNode.jsx'),
    FunctionNode = require('./FunctionNode.jsx'),
    ApplicationNode = require('./ApplicationNode.jsx'),
    RuleNode = require('./RuleNode.jsx'),
    VirtualSensorsNode = require('./VirtualSensorsNode.jsx'),

    Loading = require('./Loading.jsx'),
    ReactDOM = require('react-dom');

var Application = React.createClass({
  getInitialState: function () {
    return { currentPage: '' };
  },

  componentDidMount: function () {
    var that = this;

    api.initialize = function (page, blocklyData, RED) {
      api.RED = RED;
      that.setState({
        currentPage: page,
        blocklyData: blocklyData
      });
    };

    api.save = function (page) {
      switch (page) {
      case 'devices':
        return (new SaveDevicesNode()).save();

      case 'services':
        return (new SaveServicesNode()).save();

      case 'recommend':
      case 'require':
      case 'satisfy':
        return (new SavePropertyNode()).save();

      case 'layout':
        return (new SaveLayoutNode()).save();

      case 'definition':
        return (new SaveDefinitionNode()).save();

      case 'function':
        return (new SaveFunctionNode()).save();

      case 'rule':
        return (new SaveRuleNode()).save();

      case 'application':
        return (new SaveApplicationNode()).save();

      case 'virtual-sensor':
        return (new SaveVirtualSensorsNode()).save();
      }
    };
  },

  render: function () {
    var currentPage = <Loading />;

    switch (this.state.currentPage) {
    case 'devices':
      currentPage = <DevicesNode blocklyData={this.state.blocklyData} />;
      break;

    case 'services':
      currentPage = <ServicesNode blocklyData={this.state.blocklyData} />;
      break;

    case 'require':
      currentPage = <PropertyNode
        blocklyData={this.state.blocklyData}
        addAnyOption={true} />;
      break;

    case 'recommend':
    case 'satisfy':
      currentPage = <PropertyNode
        blocklyData={this.state.blocklyData}
        addAnyOption={false} />;
      break;

    case 'layout':
      currentPage = <LayoutNode
        blocklyData={this.state.blocklyData} />;
      break;

    case 'definition':
      currentPage = <DefinitionNode
        blocklyData={this.state.blocklyData} />;
      break;

    case 'function':
      currentPage = <FunctionNode
        blocklyData={this.state.blocklyData} />;
      break;

    case 'rule':
      currentPage = <RuleNode
        blocklyData={this.state.blocklyData} />;
      break;

    case 'application':
      currentPage = <ApplicationNode
        blocklyData={this.state.blocklyData} />;
      break;

    case 'virtual-sensor':
      currentPage = <VirtualSensorsNode
        blocklyData={this.state.blocklyData} />;
    }

    return <div>{currentPage}</div>;
  }
});

ReactDOM.render(<Application />, document.getElementById('container'));
