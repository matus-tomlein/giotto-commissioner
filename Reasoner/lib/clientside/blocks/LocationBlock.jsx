var React = require('react'),
    findVariables = require('../findVariables'),
    listToBlocklyOptions = require('./listToBlocklyOptions'),
    Blockly = require('../Blockly');

var LocationBlock = React.createClass({

  locationsAndTypes: function () {
    var locations = listToBlocklyOptions(findVariables('Location'));
    var locationTypes = findVariables('Location type').map(function (locationType) {
      return ['Any ' + locationType, '__' + locationType];
    });

    return locations.concat(locationTypes);
  },

  componentDidMount: function () {
    var locationsAndTypes = this.locationsAndTypes();

    if (locationsAndTypes.length > 0) {
      Blockly.Blocks['location'] = {
        init: function() {
          this.appendDummyInput()
            .appendField('Location')
            .appendField(new Blockly.FieldDropdown(locationsAndTypes), 'location');
          this.appendStatementInput('placements')
            .setCheck(null)
            .appendField('Contains');
          this.setColour(80);
          this.setTooltip('');
          this.setHelpUrl('http://www.example.com/');
        }
      };
    }
  },

  render: function () {
    if (this.locationsAndTypes().length == 0) return null;

    return (
      <block type="location"></block>
    );
  }

});

module.exports = LocationBlock;
