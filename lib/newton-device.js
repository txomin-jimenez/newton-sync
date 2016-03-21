
/**
  Handle all Newton Device information related command and process.
@class NewtonDevice
 */

(function() {
  var CommandBroker, NewtonDevice, Q, StateMachine, Utils, _, net;

  Q = require('q');

  _ = require('lodash');

  net = require('net');

  CommandBroker = require('./commands/command-broker');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  module.exports = NewtonDevice = (function() {

    /**
      TCP socket for device comms
    @property socket
     */
    NewtonDevice.prototype.socket = null;


    /**
    @property name
     */

    NewtonDevice.prototype.name = null;

    NewtonDevice.prototype.fNewtonID = null;

    NewtonDevice.prototype.fManufacturer = null;

    NewtonDevice.prototype.fMachineType = null;

    NewtonDevice.prototype.fROMVersion = null;

    NewtonDevice.prototype.fROMStage = null;

    NewtonDevice.prototype.fRAMSize = null;

    NewtonDevice.prototype.fScreenHeight = null;

    NewtonDevice.prototype.fScreenWidth = null;

    NewtonDevice.prototype.fPatchVersion = null;

    NewtonDevice.prototype.fNOSVersion = null;

    NewtonDevice.prototype.fInternalStoreSig = null;

    NewtonDevice.prototype.fScreenResolutionV = null;

    NewtonDevice.prototype.fScreenResolutionH = null;

    NewtonDevice.prototype.fScreenDepth = null;

    NewtonDevice.prototype.fSystemFlags = null;

    NewtonDevice.prototype.fSerialNumber = null;

    NewtonDevice.prototype.fTargetProtocol = null;


    /**
      TCP socket for device comms
    @property socket
     */

    NewtonDevice.prototype.socket = null;


    /**
    @class NewtonDevice
    @constructor
     */

    function NewtonDevice(options) {
      if (options) {
        _.extend(this, _.pick(options, ['socket', 'fNewtonID', 'fManufacturer', 'fMachineType', 'fROMVersion', 'fROMStage', 'fRAMSize', 'fScreenWidth', 'fScreenWidth', 'fPatchVersion', 'fNOSVersion', 'fInternalStoreSig', 'fScreenResolutionV', 'fScreenResolutionH', 'fScreenDepth', 'fSystemFlags', 'fSerialNumber', 'fTargetProtocol', 'name', 'protocolVersion', 'encryptedKey1', 'encryptedKey2']));
      }
      _.extend(this, StateMachine);
      _.extend(this, CommandBroker);
      this._initialize(options);
    }


    /**
      all init method go here
    @method initialize
     */

    NewtonDevice.prototype._initialize = function(options) {};


    /**
      return a object with device info 
    @method info
     */

    NewtonDevice.prototype.info = function() {
      return _.pick(this, ['fNewtonID', 'fManufacturer', 'fMachineType', 'fROMVersion', 'fROMStage', 'fRAMSize', 'fScreenWidth', 'fScreenWidth', 'fPatchVersion', 'fNOSVersion', 'fInternalStoreSig', 'fScreenResolutionV', 'fScreenResolutionH', 'fScreenDepth', 'fSystemFlags', 'fSerialNumber', 'fTargetProtocol', 'name']);
    };

    NewtonDevice.prototype.getEncryptedKeys = function() {
      return _.pick(this, ['encryptedKey1', 'encryptedKey2']);
    };

    NewtonDevice.prototype.storeNames = function() {
      return this.sendCommand('kDGetStoreNames').then((function(_this) {
        return function() {
          return _this.receiveCommand('kDStoreNames');
        };
      })(this));
    };

    NewtonDevice.prototype.newtonTime = function() {
      return this.sendCommand('kDLastSyncTime').then((function(_this) {
        return function() {
          return _this.receiveCommand('kDCurrentTime');
        };
      })(this));
    };

    NewtonDevice.prototype.sync = function() {
      console.log("syncing ...");
      return this._initSyncProcess();
    };


    /**
      Init sync process with connected device
    @method initSyncProcess
     */

    NewtonDevice.prototype._initSyncProcess = function() {
      console.log("init sync process...");
      return this.receiveCommand('kDSynchronize').then((function(_this) {
        return function() {
          return _this.sendCommand('kDGetSyncOptions');
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDSyncOptions');
        };
      })(this)).then((function(_this) {
        return function(syncOptions) {
          console.log("received sync options:");
          console.log(syncOptions);
          return _this.sendCommand('kDLastSyncTime');
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDCurrentTime');
        };
      })(this)).then((function(_this) {
        return function(newtonTime) {
          console.log("Newton time: ");
          console.log(newtonTime);
          return _this.sendCommand('kDGetStoreNames');
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDStoreNames');
        };
      })(this)).then((function(_this) {
        return function(stores) {
          console.log("store info");
          console.log(stores);
          return _this.sendCommand('kDGetSoupIDs');
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDSoupIDs').then(function(soupIds) {
            console.log("soup ids:");
            return console.log(soupIds);
          });
        };
      })(this));
    };


    /**
    @method dispose
     */

    NewtonDevice.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      this.removeAllListeners();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return NewtonDevice;

  })();

}).call(this);
