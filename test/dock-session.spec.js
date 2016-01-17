/*jshint expr: true*/

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '..' ) ) );
var NcuServer = newtonSync.NcuServer;
var expect = require( 'chai' ).expect;
var net = require('net');
var StringDecoder = require('string_decoder').StringDecoder;

describe('Dock Session', function( done ) {
    var client = null;

    before(function(done) {
      // runs before all tests in this block
      client = net.connect({port: global.testServer.newtonPort},
      function() { //'connect' listener
        done(); 
      });
    });
    
    it('should initiate docking on dock request from Newton', function(done) {
      // simulate a kDRequestToDock event from Newton to Server
      client.write("newtdockrtdk\0\0\0\4\0\0\0\9"); 
      client.on('data', function(data) {
        var decoder = new StringDecoder('ascii');
        data_ = decoder.write(data);
        expect(data_.substr(0,12)).to.equal("newtdockdock");
        done();
      });
      done();
    });
    
    it('should send a response to a event', function(done) {
      done();
    });
    
    it('should negotiate a session initiation', function(done) {
      done();
    });

    after(function() {
      client.end();
    });
});
