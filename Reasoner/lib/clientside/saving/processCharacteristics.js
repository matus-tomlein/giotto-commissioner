var $ = require('jquery');

function processCharacteristics(parentBlock) {
  var charBlocks = $(parentBlock).find('statement[name="characteristics"] block');
  var characteristics = [];

  charBlocks.each(function (n, statement) {
    var uri = $(statement).attr('type');
    var value = $(statement).find('field[name="value"]:first').text();

    characteristics.push({
      uri: uri,
      value: value
    });
  });

  return characteristics;
}

module.exports = processCharacteristics;
