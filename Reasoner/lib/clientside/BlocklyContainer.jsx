var React = require('react'),
    api = require('./externalApi'),
    $ = require('jquery'),
    Blockly = require('./Blockly');

var BlocklyContainer = React.createClass({

  _loadBlockly: function () {
    var blocklyArea = document.getElementById('blocklyArea');
    var blocklyDiv = document.getElementById('blocklyDiv');
    this.workspace = Blockly.inject(blocklyDiv,
        {
          toolbox: document.getElementById('toolbox'),
          zoom: {
            controls: true,
            wheel: false,
            startScale: 1,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
          },
          trashcan: true,
          scrollbars: true
        });
    api.workspace = this.workspace;

    var onresize = function() {
      // Compute the absolute coordinates and dimensions of blocklyArea.
      var element = blocklyArea;
      var x = 0;
      var y = 0;
      do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      } while (element);
      // Position blocklyDiv over blocklyArea.
      blocklyDiv.style.left = x + 'px';
      blocklyDiv.style.top = y + 'px';
      blocklyDiv.style.width = (blocklyArea.offsetWidth) + 'px';
      blocklyDiv.style.height = ($(window).height() - y) + 'px';
    };
    window.addEventListener('resize', onresize, false);
    onresize();
    Blockly.svgResize(this.workspace);

    if (this.props.blocklyData) {
      var xml = Blockly.Xml.textToDom(this.props.blocklyData);
      Blockly.Xml.domToWorkspace(xml, this.workspace);
    }
  },

  componentDidMount: function () {
    this._loadBlockly();
  },

  _submit: function () {
    var xml = Blockly.Xml.workspaceToDom(this.workspace);
    var xmlText = Blockly.Xml.domToText(xml);

    $('input[name=model]').val(xmlText);
    $('#form').submit();
  },

  render: function () {

    var areaStyle = { width: '100%', height: '300px' };
    var divStyle = { position: 'absolute' };
    var hideStyle = { display: 'none' };

    return (
      <div>
        <div id="blocklyArea" style={areaStyle}>
          <div id="blocklyDiv" style={divStyle}></div>
        </div>

        <xml id="toolbox" style={hideStyle}>
          {this.props.children}
        </xml>
      </div>
    );
  }

});

module.exports = BlocklyContainer;
