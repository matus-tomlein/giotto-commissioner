var instance = null;

module.exports = function getOrSetInstance(newInstance) {
  if (newInstance && instance) {
    throw 'An instance of CaseReasoner has already been created. Currently only one instance is supported.';
  }

  if (newInstance)
    instance = newInstance;

  return instance;
};
