var request = require('request'),
    ParallelReasoner = require('./ParallelReasoner'),
    OnePassReasoner = require('./OnePassReasoner'),
    reasonerInstance = require('../instance');

class ReasonRequestHandler {

  handle(req, res) {
    console.log('Received request');
    var that = this;

    that.reason(req.rawBody, (err, reasoningOutput) => {
      if (err) {
        console.error(err);
        res.sendStatus(404);
      } else {
        console.log('Responded to request');
        res.end(reasoningOutput);
      }
    });
  }

  handleAsync(body, callbackUrl) {
    console.log('Received async request');
    var that = this;

    that.reason(body, (err, reasoningOutput) => {
      if (err) {
        console.error(err);
      } else {
        console.log(callbackUrl);
        request.post(callbackUrl, { body: reasoningOutput }, (err) => {
          if (err)
            console.log(err);
        });

        console.log('Responded to request');
      }
    });
  }

  reason(requestBody, callback) {
    var nodes = reasonerInstance().getNodes();

    console.time('reasoning');
    nodes.findSources((err, sources) => {
      if (err) {
        console.timeEnd('reasoning');
        console.error(err);
      } else {
        sources.push(requestBody);

        var reasoner = new OnePassReasoner(sources, nodes);
        reasoner.reason((err, processed) => {
          console.timeEnd('reasoning');
          if (err) {
            callback(err);
          } else {
            callback(null, processed);
          }
        });
      }
    });
  }
}

module.exports = ReasonRequestHandler;
