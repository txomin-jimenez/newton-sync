
/**
  Handle all Newton Device information related command and process.
@class NewtonDevice
 */

(function() {
  var CommandBroker, NewtonDevice, NewtonStorage, Q, StateMachine, Utils, _, net;

  Q = require('q');

  _ = require('lodash');

  net = require('net');

  CommandBroker = require('./commands/command-broker');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  NewtonStorage = require('./newton-storage');

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

    NewtonDevice.prototype.sync = function() {
      console.log("syncing ...");
      return this._initSyncProcess().then((function(_this) {
        return function() {
          return _this._getStoreNames();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this._syncStores();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.sendCommand('kDOperationDone');
        };
      })(this));
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
          return console.log(newtonTime);
        };
      })(this));
    };

    NewtonDevice.prototype._getStoreNames = function() {
      console.log("getStoreNames");
      this.stores = {};
      return this.sendCommand('kDGetStoreNames').then((function(_this) {
        return function() {
          return _this.receiveCommand('kDStoreNames');
        };
      })(this)).then((function(_this) {
        return function(stores) {
          return _.each(stores, function(store_) {
            console.log(store_);
            store_.socket = _this.socket;
            return _this.stores[store_.name] = new NewtonStorage(store_);
          });
        };
      })(this));
    };

    NewtonDevice.prototype._syncStores = function() {
      console.log("syncStores");
      return _.reduce(this.stores, function(soFar, store) {
        return soFar.then(function() {
          return store.sync();
        });
      }, Q());
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
