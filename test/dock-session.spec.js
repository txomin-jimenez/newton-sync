/*jshint expr: true*/

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '..' ) ) );
var expect = require( 'chai' ).expect;
var net = require('net');
var _ = require('lodash');
var StringDecoder = require('string_decoder').StringDecoder;
var NewtonDesCrypto = require('newton-des-crypto');

describe('Dock Session', function( done ) {
    var client = null;

    before(function(done) {
      // simulate a connection from Newton device
      testNewt.connectToDock().then(function(){
        done();
      });
    });
    
    
    it('should initiate docking on dock request from Newton', function(done) {

      // simulate a session init from Newton to Server
      tx = testNewt.newCommandTransaction();
      tx.sendCommand('kDRequestToDock',{protocolVersion: 10})
      .then(function(){
        tx.receiveCommand('kDInitiateDocking')
        .then(function(){
          tx.finish();
          done();
        });
      }).catch(function(err){
        throw err;
      });
    });
    
    it('should negotiate a sync session with a Newton device', function(done){
      // continue session negotiation started on previous test
      // TO-DO: this test will break in near future because Newton device is
      // not sending data according specification we only test command 
      // communication and dock response process is ok.
      testServer._connections[(Object.keys(testServer._connections))[0]].sessionPwd = 'test123';
      global.testDockInfo = null;
      tx = testNewt.newCommandTransaction();
      tx.sendCommand('kDNewtonName',testNewt.info());
      tx.receiveCommand('kDDesktopInfo')
      .then(function(dockInfo){
        testDockInfo = dockInfo;
        tx.sendCommand('kDNewtonInfo', testNewt.newtonInfo); 
        return tx.receiveCommand('kDWhichIcons');
      }).then(function(){
        tx.sendCommand('kDResult');
        return tx.receiveCommand('kDSetTimeout');
      }).then(function(){
        var keyData = new Buffer(8);
        keyData.writeUInt32BE(testDockInfo.encryptedKey1, 0);
        keyData.writeUInt32BE(testDockInfo.encryptedKey2, 4);
        
        var encryptedData = NewtonDesCrypto.encryptBlock('test123', keyData.toString('hex'));

        testPassKeys = {
          encryptedKey1: parseInt('0x'+encryptedData.slice(0,8)),
          encryptedKey2: parseInt('0x'+encryptedData.slice(8,16))
        };
        tx.sendCommand('kDPassword', testPassKeys);
        return tx.receiveCommand('kDPassword');
      }).then(function(_passwdRes){
        tx.finish();
        global.passwdRes = _passwdRes;
        done();
      }).catch(function(err){
        throw err;
      });
    });

    it('should encrypt password keys with DES algorithm', function(){
      expect(global.passwdRes.encryptedKey1).to.equal(3420888417);
      expect(global.passwdRes.encryptedKey2).to.equal(1631650501);
    });

    it('should send a response to a event', function(done) {
      // newton send Helo command and waits for a Helo from NCU server
      tx = testNewt.newCommandTransaction();
      // send Hello command from NCU server
      
      tx.sendCommand('kDResult',0)
      .then(function(){
        return tx.sendCommand('kDHello');
      }).then(function(){
        tx.receiveCommand('kDHello').then(function(){  
          tx.finish();
          // disconn and connect again for next test because NCU Server wanted
          // a KDRequestToDock command by default and we sended kDHello for test.
          testNewt.disconnect();
          testNewt.connectToDock().then(function(){
            done();
          });
        }).catch(function(err){
          done(err);
        });
        sessionObj = testServer._connections[(Object.keys(testServer._connections))[0]];
        sessionObj.sendCommand('kDHello');

      }).catch(function(err){
        throw err;
      });
    });
    
    after(function() {
      
      testNewt.disconnect();

    });
});
