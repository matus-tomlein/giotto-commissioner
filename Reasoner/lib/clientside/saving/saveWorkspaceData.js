var api = require('../externalApi'),
    Blockly = require('../Blockly');

function saveWorkspaceData() {
  var xml = Blockly.Xml.workspaceToDom(api.workspace);
  return Blockly.Xml.domToText(xml);
}

module.exports = saveWorkspaceData;
