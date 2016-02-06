/*jshint expr: true*/

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '..' ) ) );
var NcuServer = newtonSync.NcuServer;
var FakeNewton = require('./fixtures/fake-newton');
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
    
    it('should send a response to a event', function(done) {
      done();
    });
    
    it('should initiate docking on dock request from Newton', function(done) {
      // simulate a kDRequestToDock event from Newton to Server
      // data length is 4 bytes and data is protocol version number 9
      testBuff = new Buffer(20);
      testBuff.write("newtdockrtdk",0,"ascii");
      testBuff.writeUInt32BE(4,12);      
      testBuff.writeUInt32BE(9,16);      
      client.write(testBuff);
      client.on('data', function(data) {
        var decoder = new StringDecoder('ascii');
        data_ = decoder.write(data);
        expect(data_.substr(0,12)).to.equal("newtdockdock");
        done();
      });
    });
    
    after(function() {
      client.end();
    });
});
