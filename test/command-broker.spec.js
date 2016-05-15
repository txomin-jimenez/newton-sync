/*jshint expr: true*/

var path = require( 'path' );
var CommandBroker = require( path.resolve( path.join( __dirname, '../lib/commands/command-broker' ) ) );
var expect = require( 'chai' ).expect;
var net = require('net');

var _ = require('lodash');

describe('Command Broker', function( done ) {
    
    before(function(done) {
      
      global.commBrokerNetServer = net.createServer(function(conn){
        global.testCommandBroker = new CommandBroker({socket: conn});
        done();
      }); 
      commBrokerNetServer.listen(3666, '0.0.0.0');
      
      global.commBrokerSocket = net.connect({port: 3666}, function(){
      });

    });
    
    it('it should create new transactions', function() {
      global.testTx1 = testCommandBroker.newTransaction('testTx1');
      expect(testTx1).not.to.be.null;
      expect(testCommandBroker._transactionQueue).to.have.length(0);
      expect(testCommandBroker.currTransaction).not.to.be.null;
    });
    
    it('it should queue new transactions', function() {
      global.testTx2 = testCommandBroker.newTransaction('testTx2');
      expect(testCommandBroker._transactionQueue).to.have.length(1);
    
    });
    
    it('it should process transactions', function(done) {
      testTx1.sendCommand('kDHello').then(function(){
        testTx1.finish().then(function(){
          // testTx1 finished, queued testTx2 must be current transaction
          // and queue must be empty
          expect(testCommandBroker._transactionQueue).to.have.length(0);
          done(); 
        });
      });
      
    });
    
    it('it should listen tcp socket for Newton commands', function(done) {
      testCommandBroker.once('command-received',function(){

        done();
      });
      global.commBufferXX = new Buffer('6e657774646f636b7274646b0000000400000009','hex');
      commBrokerSocket.write(commBufferXX, function(){
      });
    });
    
    it('it should route received commands to transaction', function(done) {
      testTx2.once('command-received',function(){
        done();
      });

      commBrokerSocket.write(commBufferXX, function(){
      });
    });
    
    it('it should be disposable', function() {
      testCommandBroker.dispose();
      expect(testCommandBroker).not.to.have.ownProperty('_transactionQueue');
      expect(testCommandBroker.disposed).to.be.true;
    });
    
    after(function() {
      commBrokerSocket.destroy();
      commBrokerNetServer.close();
    });
});
