/*jshint expr: true*/

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '..' ) ) );
var NcuServer = newtonSync.NcuServer;
var expect = require( 'chai' ).expect;
var net = require('net');

global.testServer = null;

before(function() {
  // runs before all tests in the test suite
  global.testServer = new NcuServer();
});

after(function() {
  // runs after all test in the test suite
  global.testServer.dispose();
});
