function listToBlocklyOptions(list) {
  return list.map(function (item) {
    return [item, item];
  });
}

module.exports = listToBlocklyOptions;
