var express = require('express');

var app = module.exports = express();

// Add a simple route for static content served from 'public'
app.use('/', express.static(__dirname + '/../public'));
