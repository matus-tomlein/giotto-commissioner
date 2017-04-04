var React = require('react'),

    listToBlocklyOptions = require('./listToBlocklyOptions'),
    findVariables = require('../findVariables'),
    Blockly = require('../Blockly');

function addAnyToOptions(options) {
  return [['Any', '']].concat(options);
}

function propertyColor(kind) {
  if (kind == 'requirement')
    return 160;
  else if (kind == 'application')
    return 260;
  else if (kind == 'networking')
    return 230;
  else
    return 60;
}

var PropertyBlock = React.createClass({

  componentDidMount: function () {
    var props = this.props;

    var devices = listToBlocklyOptions(findVariables('Device'));
    var resources = listToBlocklyOptions(findVariables('Resource'));
    var locations = listToBlocklyOptions(findVariables('Location'));
    var providers = listToBlocklyOptions(findVariables('DataProvider'));
    var consumers = listToBlocklyOptions(findVariables('DataConsumer'));
    var virtualSensors = listToBlocklyOptions(findVariables('VirtualSensor'));

    if (props.addAnyOption) {
      devices = addAnyToOptions(devices);
      resources = addAnyToOptions(resources);
      locations = addAnyToOptions(locations);
      providers = addAnyToOptions(providers);
      consumers = addAnyToOptions(consumers);
      virtualSensors = addAnyToOptions(virtualSensors);
    }

    Blockly.Blocks[props.blockName] = {
      init: function() {
        this.appendDummyInput()
          .appendField(props.title);
        var that = this;

        props.parameters.map(function (parameter) {
          var input = that.appendDummyInput()
            .appendField(parameter.name);

          switch (parameter.accepts) {
          case 'DataProvider':
            input.appendField(new Blockly.FieldDropdown(providers), parameter.uri);
            break;

          case 'DataConsumer':
            input.appendField(new Blockly.FieldDropdown(consumers), parameter.uri);
            break;

          case 'Device':
            input.appendField(new Blockly.FieldDropdown(devices), parameter.uri);
            break;

          case 'Resource':
            input.appendField(new Blockly.FieldDropdown(resources), parameter.uri);
            break;

          case 'Location':
            input.appendField(new Blockly.FieldDropdown(locations), parameter.uri);
            break;

          case 'VirtualSensor':
            input.appendField(new Blockly.FieldDropdown(virtualSensors), parameter.uri);
            break;

          case 'Text':
            input.appendField(new Blockly.FieldTextInput(''), parameter.uri);
            break;

          case 'Select':
            var options = parameter.options.map(function (option) { return [option, option]; });

            if (props.addAnyOption)
              options = addAnyToOptions(options);

            input.appendField(new Blockly.FieldDropdown(options), parameter.uri);
            break;
          }
        });

        this.setColour(propertyColor(props.kind));

        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
      }
    };
  },

  render: function () {
    return (
      <block type={this.props.blockName}></block>
    );
  }

});

module.exports = PropertyBlock;
