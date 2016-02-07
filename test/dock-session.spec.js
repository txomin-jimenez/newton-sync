/*jshint expr: true*/

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '..' ) ) );
var expect = require( 'chai' ).expect;
var net = require('net');
var _ = require('lodash');
var StringDecoder = require('string_decoder').StringDecoder;

describe('Dock Session', function( done ) {
    var client = null;

    before(function(done) {
      testNewt.connectToDock().then(function(){
        done();
      });
    });
    
    it('should send a response to a event', function(done) {
      // newton send Helo command and waits for a Helo from NCU server
      testNewt.sendCommand('kDHello');
      testNewt.receiveCommand('kDHello').then(function(){  
        // disconn and connect again for next test because NCU Server wanted
        // a KDRequestToDock command by default and we sended kDHello for test.
        testNewt.disconnect();
        testNewt.connectToDock().then(function(){
          done();
        });
      }); 
      testServer._connections[(Object.keys(testServer._connections))[0]].sendCommand('kDHello');
    });
    
    it('should initiate docking on dock request from Newton', function(done) {
      // simulate a session init from Newton to Server
      // TO-DO: this test will break in near future because Newton device is
      // not sending data according specification we only test command 
      // communication and dock response process is ok.
      testNewt.sendCommand('kDRequestToDock',{protocolVersion: 10});
      testNewt.receiveCommand('kDInitiateDocking')
      .then(function(){
        testNewt.sendCommand('kDNewtonName',testNewt.info());
        return testNewt.receiveCommand('kDDesktopInfo');
      }).then(function(){
        testNewt.sendCommand('kDNewtonInfo'); 
        return testNewt.receiveCommand('kDWhichIcons');
      }).then(function(){
        testNewt.sendCommand('kDResult');
        return testNewt.receiveCommand('kDSetTimeout');
      }).then(function(){
        testNewt.sendCommand('kDPassword');
        return testNewt.receiveCommand('kDResult');
      }).then(function(){
        done();
      })
      .catch(function(err){
        throw new Error(err);
      });
    });
    
    it('should negotiate a sync session with a Newton device', function(done){
      done();
    });

    after(function() {
      testNewt.disconnect();
    });
});
