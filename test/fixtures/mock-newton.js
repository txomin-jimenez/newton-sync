/**
  Use lib Newton device class in order to mock a Newton device in test env
@class MockNewton  
*/

var MockNewton,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

var path = require( 'path' );
var newtonSync = require( path.resolve( path.join( __dirname, '../..' ) ) );
var NewtonDevice = newtonSync.NewtonDevice;

var net = require('net');
var Q = require('q');
var _ = require('lodash');

module.exports = MockNewton = (function(superClass) {
  extend(MockNewton, superClass);

  function MockNewton() {
    return MockNewton.__super__.constructor.apply(this, arguments);
  }

  MockNewton.name = 'Test Suite Newton';

  MockNewton.prototype.newtonInfo = {
    protocolVersion: 10,
    encryptedKey1: 0x00783c8c, 
    encryptedKey2: 0x002bb602}; 

  /**
    Connect to doc. Used to mock Newton device connection in test environment
  @method connectToDock
  */ 
  MockNewton.prototype.connectToDock = function(options) {
    var deferred, opts_;
    deferred = Q.defer();
    opts_ = {
      port: 3679
    };
    _.extend(opts_, options);
    if (this.socket === null) {
      this.socket = net.connect(opts_, function() {
        return deferred.resolve();
      });
    }
    return deferred.promise;
  };
  
  /**
    Disconnect from dock. Used in test environment 
  @method disconnect
  */
  MockNewton.prototype.disconnect = function() {
    if (this.socket !== null) {
      this.socket.end();
      this.socket = null;
      return null;
    }
  };

  return MockNewton;

})(NewtonDevice);
