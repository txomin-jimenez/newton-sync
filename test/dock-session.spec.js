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
      testNewt.sendCommand('kDRequestToDock',{protocolVersion: 10});
      testNewt.receiveCommand('kDInitiateDocking')
      .then(function(){
        done();
      }).catch(function(err){
        throw new Error(err);
      });
    });
    
    it('should negotiate a sync session with a Newton device', function(done){
      // continue session negotiation started on previous test
      // TO-DO: this test will break in near future because Newton device is
      // not sending data according specification we only test command 
      // communication and dock response process is ok.
      testServer._connections[(Object.keys(testServer._connections))[0]].sessionPwd = 'test123';
      global.testDockInfo = null;
      testNewt.sendCommand('kDNewtonName',testNewt.info());
      testNewt.receiveCommand('kDDesktopInfo')
      .then(function(dockInfo){
        console.log('.................................');
        console.log(_.pick(dockInfo,['encryptedKey1','encryptedKey2']));
        testDockInfo = dockInfo;
        testNewt.sendCommand('kDNewtonInfo', testNewt.newtonInfo); 
        return testNewt.receiveCommand('kDWhichIcons');
      }).then(function(){
        testNewt.sendCommand('kDResult');
        return testNewt.receiveCommand('kDSetTimeout');
      }).then(function(){
        var keyData = new Buffer(8);
        keyData.writeUInt32BE(testDockInfo.encryptedKey1, 0);
        keyData.writeUInt32BE(testDockInfo.encryptedKey2, 4);
        
        var encryptedData = NewtonDesCrypto.encryptBlock('test123', keyData.toString('hex'));

        testPassKeys = {
          encryptedKey1: parseInt('0x'+encryptedData.slice(0,8)),
          encryptedKey2: parseInt('0x'+encryptedData.slice(8,16))
        };
        testNewt.sendCommand('kDPassword', testPassKeys);
        return testNewt.receiveCommand('kDPassword');
      //}).then(function(){
        //return testNewt.receiveCommand('kDResult');
      }).then(function(_passwdRes){
        global.passwdRes = _passwdRes;
        done();
      }).catch(function(err){
        throw new Error(err);
      });
    });

    it('should encrypt password keys with DES algorithm', function(){
      expect(global.passwdRes.encryptedKey1).to.equal(3420888417);
      expect(global.passwdRes.encryptedKey2).to.equal(1631650501);
    });

    after(function() {
      //console.log("_____________________________________________________");
      //console.log("Newt -> Desktop, NewtonInfo send test keys");

      //passTestBuff1 = new Buffer([0x00,0x00 ,0x00 ,0x0a ,0x00 ,0x65 ,0x0c ,0x16 ,0x00 ,0x58 ,0x92 ,0xeb]);

      //console.log(passTestBuff1.readUInt32BE(0));
      //console.log(passTestBuff1.readUInt32BE(4));
      //console.log(passTestBuff1.readUInt32BE(8));

      //console.log("_____________________________________________________");
      //console.log("Desktop -> Newt. DesktopInfo sent keys");
      //console.log(1434875146);
      //console.log(1852706659);
      //console.log("_____________________________________________________");
      //console.log("Newton -> Desktop Password send test keys");
      //passTestBuff2 = new Buffer([0x5a,0xf1 ,0x16 ,0x2b ,0xee ,0xbb ,0xcd ,0xca]);
      
      //console.log(passTestBuff2.readUInt32BE(0));
      //console.log(passTestBuff2.readUInt32BE(4));
      
      //console.log("_____________________________________________________");
      //console.log("Desktop -> Newton. NCX Password send test keys");
      //passTestBuff3 = new Buffer([0x6e,0x65 ,0x77 ,0x74 ,0x64 ,0x6f ,0x63 ,0x6b ,0x70 ,0x61 ,0x73 ,0x73 ,0x00 ,0x00 ,0x00 ,0x08 ,0xc1 ,0x3c ,0xb9 ,0x49 ,0xed ,0xbe ,0x4e ,0x23]);
      //console.log(passTestBuff3.readUInt32BE(16));
      //console.log(passTestBuff3.readUInt32BE(20));
      
      //console.log("_____________________________________________________");
      
      //console.log("Desktop sent key:");
      //buffTest = new Buffer([0x10, 0x94, 0x7d, 0xc9, 0x04, 0xce, 0x1f, 0xa0]);
      //console.log(buffTest.readUInt32BE(0) + ' ' + buffTest.readUInt32BE(4));
 
      //console.log("Newton sent key:");
      //buffTest = new Buffer([0x2c, 0x4b, 0x29, 0xe1, 0xd7, 0x05, 0x59, 0x3e]);
      //console.log(buffTest.readUInt32BE(0) + ' ' + buffTest.readUInt32BE(4));
      
      //console.log("our result:");
      //buffTest = new Buffer([0xff, 0xff, 0x92, 0x95]);
      //console.log(buffTest.readInt32BE(0)) ;
      
      //console.log("their result:");
      //buffTest = new Buffer([0xff, 0xff, 0xff, 0xfc]);
      //console.log(buffTest.readInt32BE(0)) ;
      
      //newtonKeys = new Buffer('ff8a5c97006dd480','hex');
      //newtonKeysNCXEncrypted = new Buffer('9d15b7ac11c7311a','hex'); 
      //console.log("NewtonKeys:");
      //console.log(newtonKeys);
      //console.log("newtonKeysEncrypted:");
      //console.log(newtonKeysNCXEncrypted);
      
      testNewt.disconnect();

    });
});
