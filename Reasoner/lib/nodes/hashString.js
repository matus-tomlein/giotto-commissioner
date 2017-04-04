var crypto = require('crypto');

function hashString(str) {
  return crypto.createHash('md5').update(str || '').digest('hex');
}

module.exports = hashString;
