var N3 = require('n3'),
    ReasonRequestHandler = require('./reasoner/ReasonRequestHandler'),
    EntityQuery = require('../../Ontology/EntityQuery'),
    N3Util = N3.Util;

module.exports = function (app, reasoner) {
  app.use(function(req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
      req.rawBody += chunk;
    });

    req.on('end', function() {
      next();
    });
  });

  app.post('/api/reason', function (req, res) {
    var requestHandler = new ReasonRequestHandler();
    requestHandler.handle(req, res);
  });

  app.post('/api/reason_async', function (req, res) {
    var requestHandler = new ReasonRequestHandler();
    var callbackUrl = req.query.uri;
    if (callbackUrl) {
      res.sendStatus(200);
      requestHandler.handleAsync(req.rawBody, callbackUrl);
    } else {
      res.sendStatus(404);
    }
  });

  app.get('/api/ontology', function (req, res) {
    var CaseReasoner = require('./index');
    var nodes = CaseReasoner.instance().getNodes();

    nodes.findSources(function (err, sources) {
      if (err) {
        res.status(404).send(err);
        console.error(err);
      } else {
        nodes.ontologyFor(sources, function (err, ontology) {
          ontology.process(function (err) {
            if (err) {
              res.status(404).send(err);
              console.error(err);
            } else {
              res.end(ontology.processed);
            }
          });
        });
      }
    });
  });

  app.get('/api/rules', function (req, res) {
    var CaseReasoner = require('./index');
    var nodes = CaseReasoner.instance().getNodes();
    nodes.findSources(function (err, sources) {
      if (err) {
        res.status(404).send(err);
      } else {
        nodes.ontologyFor(sources, function (err, ontology) {
          ontology.serializeFlows(function (err, data) {
            if (err) {
              res.status(404).send(err);
            } else {
              res.end(data);
            }
          });
        });
      }
    });
  });


  app.get('/api/blocks/:blockName', function (req, res) {
    reasoner.blocks.readDefinition(req.params.blockName, function (err, data) {
      if (err) {
        res.status(404).send(err);
      } else {
        res.end(data);
      }
    });
  });

  app.post('/api/blocks/:blockName', function (req, res) {
    var body = req.rawBody;

    reasoner.blocks.saveDefinition(req.params.blockName, body, function () {
      res.end('OK');
    });
  });

  app.delete('/api/blocks/:blockName', function (req, res) {
    reasoner.blocks.deleteBlock(req.params.blockName, function (err) {
      if (err) {
        res.status(404).send(err);
      } else {
        res.end('OK');
      }
    });
  });

  app.get('/api/blocks_n3', function (req, res) {
    reasoner.blocks.toN3(function (err, n3) {
      res.end(n3);
    });
  });

  app.get('/api/blocks', function (req, res) {
    reasoner.blocks.getBlockNames(function (err, blockNames) {
      if (err) {
        res.status(404).send(err);
      } else {
        res.end(JSON.stringify(blockNames));
      }
    });
  });

  app.get('/api/device_categories', function (req, res) {
    var categories = {
      twoWayValve: '2-way valve',
      threeWayValve: '3-way valve',
      fourWayValve: '4-way valve',
      ac: 'A/C unit',
      camera: 'Camera',
      computer: 'Computer',
      pump: 'Pump',
      doorLock: 'Door lock',
      fan: 'Fan',
      heater: 'Heater',
      keyPad: 'Key-pad',
      light: 'Light',
      motionDetector: 'Motion detector',
      pressureSensor: 'Pressure sensor',
      smokeDetector: 'Smoke detector',
      soundAlarm: 'Sound alarm',
      temperatureSensor: 'Temperature sensor'
    };

    res.end(JSON.stringify(categories));
  });

  app.get('/api/service_characteristics', function (req, res) {
    serviceCharacteristics(function (err, definitions) {
      if (err) {
        console.error(err);
        res.sendStatus(404);
      } else {
        res.end(JSON.stringify(definitions));
      }
    });
  });

  app.get('/api/device_characteristics', function (req, res) {
    deviceCharacteristics(function (err, definitions) {
      if (err) {
        console.error(err);
        res.sendStatus(404);
      } else {
        res.end(JSON.stringify(definitions));
      }
    });
  });

  app.get('/api/property_types', function(req, res) {
    propertyTypes(function (err, definitions) {
      if (err) {
        console.error(err);
        res.sendStatus(404);
      } else {
        res.end(JSON.stringify(definitions));
      }
    });
  });

  app.get('/api/application_definitions', function(req, res) {
    applicationDefinitions(function (err, definitions) {
      if (err) {
        console.error(err);
        res.sendStatus(404);
      } else {
        res.end(JSON.stringify(definitions));
      }
    });
  });

  app.get('/api/location_types', function(req, res) {
    locationTypes(function (err, types) {
      if (err) {
        console.error(err);
        res.sendStatus(404);
      } else {
        res.end(JSON.stringify(types));
      }
    });
  });
};

function serviceCharacteristics(callback) {
  characteristics('ServiceCharacteristicType', callback);
}

function deviceCharacteristics(callback) {
  characteristics('DeviceCharacteristicType', callback);
}

function characteristics(type, callback) {
  findStore(function (err, store, vocab) {
    if (err) {
      callback(err);
    } else {
      var query = new EntityQuery(type, vocab, store);
      var characteristics = query.all();
      characteristics = characteristics.map(function (characteristic) {
        return {
          uri: characteristic.getUri(),
          description: characteristic.literals.description,
          options: characteristic.literals.option,
          valueType: characteristic.literals.valueType
        };
      });

      callback(null, characteristics);
    }
  });
}

function propertyTypes(callback) {
  findStore(function (err, store, vocab) {
    if (err) {
      callback(err);
    } else {
      var statements = store.find(null, vocab.rdf('type'), vocab.case('PropertyType'));
      var allPropertyTypes = statements.map(function (node) {
        var propertyType = {};
        propertyType.uri = node.subject;

        var titleSt = store.find(node.subject, vocab.case('title'), null)[0];
        if (titleSt) {
          propertyType.title = N3Util.getLiteralValue(titleSt.object);
        }

        var kind = store.find(node.subject, vocab.case('kind'), null)[0];
        if (kind) {
          propertyType.kind = N3Util.getLiteralValue(kind.object);
        }

        var parameters = store.
          find(node.subject, vocab.case('parameter'), null).
          map(function (paramNode) {
            var parameter = {};
            parameter.uri = paramNode.object;

            var name = store.find(paramNode.object, vocab.case('name'), null)[0];
            if (name) {
              parameter.name = N3Util.getLiteralValue(name.object);
            }

            var accepts = store.find(paramNode.object, vocab.case('accepts'), null)[0];
            if (accepts) {
              parameter.accepts = N3Util.getLiteralValue(accepts.object);

              if (parameter.accepts == 'Select') {
                parameter.options = store.find(paramNode.object, vocab.case('option'), null).map(function (optionStatement) {
                  return N3Util.getLiteralValue(optionStatement.object);
                });
              }
            }

            return parameter;
          });

        propertyType.parameters = parameters;

        return propertyType;
      });

      callback(null, allPropertyTypes);
    }
  });
}

function applicationDefinitions(callback) {
  findStore(function (err, store, vocab) {
    if (err) {
      callback(err);
    } else {
      var applicationTypes = store.find(null, vocab.rdf('type'), vocab.case('Application'));
      var allApplications = applicationTypes.map(function (applicationType) {
        var app = {};
        app.uri = applicationType.subject;

        var nameSt = store.find(applicationType.subject, vocab.case('name'), null)[0];
        if (nameSt) {
          app.name = N3Util.getLiteralValue(nameSt.object);
        }

        app.requirements = store.find(applicationType.subject, vocab.case('property'), null).map(function (req) {
          var requirement = {};
          var title = store.find(req.object, vocab.case('title'), null)[0];
          if (title) {
            requirement.title = N3Util.getLiteralValue(title.object);
          }

          return requirement;
        });

        return app;
      });

      callback(null, allApplications);
    }
  });
}

function locationTypes(callback) {
  findStore(function (err, store, vocab) {
    if (err) {
      callback(err);
    } else {
      var types = store.find(null, vocab.rdf('type'), vocab.case('LocationType'));
      var allLocations = types.map(function (locationType) {
        var location = {};
        location.uri = locationType.subject;

        var nameSt = store.find(locationType.subject, vocab.case('name'), null)[0];
        if (nameSt) {
          location.name = N3Util.getLiteralValue(nameSt.object);
        }

        return location;
      });

      callback(null, allLocations);
    }
  });
}

function findStore(callback) {
  var CaseReasoner = require('./index');
  var vocab = CaseReasoner.vocabulary;

  var nodes = CaseReasoner.instance().getNodes();
  nodes.findSources(function (err, sources) {
    if (err) {
      callback(err);
    } else {
      nodes.storeFor(sources, function (err, store) {
        if (err) {
          callback(err);
        } else {
          callback(null, store, vocab);
        }
      });
    }
  });
}

