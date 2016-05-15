/*jshint expr: true*/

var path = require( 'path' );
var CommandTransaction = require( path.resolve( path.join( __dirname, '../lib/commands/command-transaction' ) ) );
var EventCommand = require( path.resolve( path.join( __dirname, '../lib/commands/event-command' ) ) );
var expect = require( 'chai' ).expect;
var net = require('net');

var _ = require('lodash');
var Q = require('q');

describe('Command Transaction', function( done ) {
    var client = null;

    before(function(done) {
      
      global.commTxNetServer = net.createServer(function(conn){
        global.commServerSocket = conn;
        global.testTx1 = new CommandTransaction({socket: conn, consumerId: 'testTx1'});
        
        done();
      }); 
      commTxNetServer.listen(3666, '0.0.0.0');
      
      global.commTxSocket = net.connect({port: 3666}, function(){
      });
      
      //commTxSocket.on('data', function(data){
        //console.log("socket data -->");
        //console.log(data.toString());
      //});

    });
    
    it('it should process operations', function(done) {

      testTx1.once('command-queued',function(){
        // command must be in queue 
        expect(testTx1._commandQueue).to.have.length.above(0);
        testTx1.once('ready',function(){
          // command finished. queue must be empty
          expect(testTx1._commandQueue).to.have.lengthOf(0);
          // finish transaction
          testTx1.finish().then(function(){
          });
          // wait for hello to arrive
          commTxSocket.once('data', function(data){
            done();
          });
        });
      });

      testTx1.sendCommand('kDHello');
      testTx1.execute();

    });
    
    it('it should queue operations and process one at a time', 
    function(done) {

      global.testTx2 = new CommandTransaction({socket: commServerSocket, consumerId: 'testTx2'});
      //testTx2.on('state_change',function(tx, newState){
        //console.log("testTx2 new state: " + newState);
        //console.log(testTx2._commandQueue.length);
      //});
      testTx2.once('command-queued',function(){
        // send a second command after first
        testTx2.sendCommand('kDInitiateDocking',{sessionType: 0});
        // 2 commands must be in queue 
        expect(testTx2._commandQueue).to.have.lengthOf(2);
        
        // receiving kDRequestToDock
        testTx2.once('receiving',function(){
          // only kDInitiateDocking must be in queue
          expect(testTx2._commandQueue).to.have.lengthOf(1);
          expect(testTx2._commandQueue[0]).to.have.property('action','send');
          expect(testTx2._commandQueue[0]).to.have.property('command','kDInitiateDocking');
          done();
        });
        // execute transaction with 2 commands in queue 
        testTx2.execute();
      });

      testTx2.receiveCommand('kDRequestToDock');

    });
    
    it('it should queue commands if busy', function(done){
      // testTx2 transaction is receving command; is busy
      
      testTx2.once('command-queued',function(){
        // 2 commands in queue: kDInitiateDocking and kDDesktopInfo
        expect(testTx2._commandQueue).to.have.lengthOf(2);
        done();

      });
      
      // send another command that must be queued 
      testTx2.sendCommand('kDDesktopInfo',{protocolVersion: 10});

    });
    
    it('it should receive commands', function(done){
      // continue transaction testTx2
      testTx2.once('ready',function(){
        // kDRequestToDock received and processed.
        // wait for first command sent, we capture here and check data in next
        // test
        commTxSocket.once('data', function(data){
          global.commTxRes1 = data;
          done();
        });
      });
      
      // fake expected command to arrive
      command = EventCommand.parse('kDRequestToDock', {protocolVersion: 10});
      
      // this is what CommandBroker does to route received commands to transact.
      testTx2.emit('command-received', command);
      
    });
    
    it('it should send dock commands', function(done) {
      // check that received command is kDInitiateDocking
      testCommandBuff = EventCommand.parse('kDInitiateDocking',{sessionType: 0});
      expect(commTxRes1.equals(testCommandBuff.toBinary())).to.be.true;

      // will continue sending KDDesktop info. 
      commTxSocket.once('data', function(data){
        testCommandBuff = EventCommand.parse('kDDesktopInfo',{protocolVersion: 10});
        expect(data.equals(testCommandBuff.toBinary())).to.be.true;
        done();
      });
      
    });
    
    //it('it should listen for dock commands from device', function() {
    //});
    
    
    it('it should finish transaction', function(done) {

      testTx2.whenFinished().then(function(){
        done();
      });
      
      // this is not immediate, will queue finish command. Pending operations
      // continue
      testTx2.finish();
    });


    it('it should be disposable', function() {
      testTx2.dispose();
      expect(testTx2).not.to.have.ownProperty('_commandQueue');
      expect(testTx2.disposed).to.be.true;
    });
    
    it('it should handle errors in process', function(done) {
      
      global.testTx3 = new CommandTransaction({socket: commServerSocket, consumerId: 'testTx3'});

      testTx3.execute();

      Q().then(function(){
        return(testTx3.sendCommand('kDDesktopInfo'));
      }).catch(function(err){
        expect(err).to.have.property('message',"Cannot read property 'protocolVersion' of undefined");
        done();
      });


    });
    
    after(function(done) {
      setTimeout(function(){
        global.commTxSocket.destroy();
        commTxNetServer.close();
        done();
      }, 100);
    });
});
