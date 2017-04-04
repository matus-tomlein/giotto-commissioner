var CaseReasoner = require('./lib');

if (process.argv.length < 3) {
  console.error('Pass an argument to indicate the name of the session.');
} else {
  var sessionName = process.argv[2];

  var port = 8080;
  if (process.argv.length > 3)
    port = process.argv[3];

  var settings = {
    port: port,
    rules: {
      flowFile: __dirname + '/' + sessionName + '.json',
      userDir: __dirname
    }
  };

  new CaseReasoner(settings);
}
