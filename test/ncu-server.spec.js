/*jshint expr: true*/

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '..' ) ) );
var NcuServer = newtonSync.NcuServer;
var expect = require( 'chai' ).expect;
var net = require('net');

var _ = require('lodash');

describe('NCU Server', function( done ) {
    var client = null;

    before(function() {
      // runs before all tests in this block
      testServer = global.testServer;
    });
    
    it('should listen connections from Newtons', function(done) {
      client = net.connect({port: testServer.httpPort},
      function() { //'connect' listener
        done(); 
      });
    });
    
    it('should queue connections', function(done) {
      // check previous test connection
      expect(testServer.connectionsCount()).to.equal(1);   
      // disconnect client for next test case
      client.on('close', function() {
        done();
      });
      client.destroy();
      
    });
    
    it('should emit a new-session event', function(done){
      client = null;
      testServer.on('new-session', function (newSession){
        client.on('close', function() {
          done();
        });
        client.destroy();
      });
      client = net.connect({port: testServer.httpPort});
    });
    
    it('should remove a finished connection from queue', function(){
      // check previous test case disconn
      expect(testServer.connectionsCount()).to.equal(0);   
    });

    after(function() {
      client.end();
    });
});
