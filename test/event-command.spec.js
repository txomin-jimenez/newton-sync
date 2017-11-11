/*jshint expr: true*/

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '..' ) ) );
var EventCommand = newtonSync.EventCommand;
var expect = require( 'chai' ).expect;
var net = require('net');

var _ = require('lodash');

describe('Event Command', function( done ) {
    var client = null;

    
    it('should register event command classes automatically', function() {
      testComm = EventCommand.parse('kDHello');
      expect(_.size(EventCommand._dockCommands)).not.to.equal(0);   
    });
    
    it('should parse command from JSON to correct class', function() {
      var commId;
      commId = 'dock';
      testCommand = EventCommand.parse(commId,null);
      expect(testCommand.name).to.equal('kDInitiateDocking');
    });

    it('should parse command from Binary to correct class', function() {
      // recreate a rtdk command from a Newton device
      var commBuffer = new Buffer([0x6e, 0x65, 0x77, 0x74, 0x64, 0x6f, 0x63, 
0x6b,0x72, 0x74, 0x64, 0x6b, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x09]);

      global.testCommand = EventCommand.parseFromBinary(commBuffer);
      expect(global.testCommand.name).to.equal('kDRequestToDock');
    });
    
    it('should parse data payload from Binary command', function() {
      // check previous command parse. expect received payload from Newton
      // to pass command specification
      expect(global.testCommand.data).to.include.keys('protocolVersion');
      expect(global.testCommand.data.protocolVersion).to.equal(9);

    });
    
    it('should convert command to binary', function() {
      testCommand = EventCommand.parse('kDInitiateDocking',{sessionType: 2});
      // recreate dock command response 
      var dockBuffer = new Buffer([0x6e, 0x65, 0x77, 0x74, 0x64, 0x6f, 0x63, 0x6b, 0x64, 0x6f, 0x63, 0x6b, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x02 ]);
      expect(testCommand.toBinary().equals(dockBuffer)).to.be.true;
    
    });

});
