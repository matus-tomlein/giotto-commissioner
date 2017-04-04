var Eye = require('./Eye.js');

// eye.execute({data: [rule1, rule2]}, function (err, output) {console.log(output);})
// eye.pass(rule, function (err, output) {console.log(output);})

var Reasoner = function Reasoner() {
};

Reasoner.prototype.reason = function (data, callback) {
  var eye = new Eye();

  // console.time('reasoning');
  eye.execute({data: data}, function (err, output) {
    // console.timeEnd('reasoning');
    callback(err, output);
  });
};

module.exports = Reasoner;
