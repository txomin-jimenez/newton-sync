/*jshint expr: true*/

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '..' ) ) );
var NsOF = newtonSync.NsOF;
var EventCommand = newtonSync.EventCommand;
var expect = require( 'chai' ).expect;
var net = require('net');

var _ = require('lodash');

describe('NSOF', function( done ) {
    var client = null;

    it('should encode a number', function (){
      global.NsOFimmediate = new Buffer('020004','hex');
      expect(NsOF.encode(1).equals(NsOFimmediate)).to.be.true;
    });
    
    it('should decode a number', function (){
      expect(NsOF.decode(NsOFimmediate)).to.equal(1);
    });
    
    it('should encode a number greater than 255', function (){
      NsOFimmediate = new Buffer('0200FF00003CCC','hex');
      expect(NsOF.encode(3891).equals(NsOFimmediate)).to.be.true;
    });
    
    it('should decode number greater than 255', function (){
      expect(NsOF.decode(NsOFimmediate)).to.equal(3891);
    });
    
    it('should encode a string', function (){
      global.NsOfString = new Buffer('02081A00570061006C00740065007200200053006D0069007400680000','hex');
      expect(NsOF.encode("Walter Smith").equals(NsOfString)).to.be.true;
    });
    
    it('should decode a string', function (){
      expect(NsOF.decode(NsOfString)).to.equal("Walter Smith");
    });
    
    it('should encode an array', function (){
      global.NsOfArray = new Buffer('02050208080066006f006f000008080062006100720000','hex');
      expect(NsOF.encode(['foo','bar']).equals(NsOfArray)).to.be.true;
    });
    
    it('should decode an array', function (){
      expect(_.isEqual(NsOF.decode(NsOfArray),['foo','bar'])).to.be.true;
    });

    it('should encode an frame object', function (){
      global.NsOfObject = new Buffer('02060207046E616D65070463617473081A00570061006C00740065007200200053006D00690074006800000008','hex'); 
      expect(NsOF.encode({name: "Walter Smith", cats: 2}).equals(NsOfObject)).to.be.true;
    });
    
    it('should decode an frame object', function (){
      expect(_.isEqual(NsOF.decode(NsOfObject),{name: "Walter Smith", cats: 2})).to.be.true;
    });
    
    it('should encode a complex frame object', function (){
      testBuff = new Buffer('6e657774646f636b64696e66000000660000000a000000005586750a6e6e0f630000000100000001020501060407046e616d6507026964070776657273696f6e0708646f65734175746f0824004e006500770074006f006e00200043006f006e006e0065006300740069006f006e000000080004001a0000','hex');
      opts = {
        protocolVersion: 10,
        desktopType: 0,
        encryptedKey1: 1434875146,
        encryptedKey2: 1852706659,
        sessionType: 1,
        allowSelectiveSync: 1,
        desktopApps: [{name: "Newton Connection", id: 2, version: 1, doesAuto: true}]
      };

      testCommand = EventCommand.parse('kDDesktopInfo',opts);
      commBuff = testCommand.toBinary();
      expect(commBuff.equals(testBuff)).to.be.true;
    });
    
    it('should decode a complex frame object', function (){
      complexBuff = new Buffer('020501060a07046e616d6507097369676e61747572650709546f74616c53697a6507085573656453697a6507046b696e640704696e666f0708726561644f6e6c79070d73746f726570617373776f7264070c64656661756c7453746f7265070c73746f726576657273696f6e08120049006e007400650072006e0061006c000000ffddd1bdb800ff01d2308000ff0030dfd008120049006e007400650072006e0061006c00000a0a0a001a0010000000','hex');
      complexObj =[ { name: 'Internal',
           signature: -143364242,
           TotalSize: 7638048,
           UsedSize: 800756,
           kind: 'Internal',
           info: null,
           readOnly: null,
           storepassword: null,
           defaultStore: true,
           storeversion: 4 } ] ;
      expect(_.isEqual(NsOF.decode(complexBuff),complexObj)).to.be.true;
    });

});
