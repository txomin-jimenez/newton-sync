
/**
  Handle all Newton Device information related command and process.
@class NewtonDevice
 */

(function() {
  var CommandBroker, NewtonDevice, NewtonStorage, Q, StateMachine, Utils, _, net,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

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
      this._fullSync = bind(this._fullSync, this);
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

    NewtonDevice.prototype.initSyncSession = function() {
      this.listenForCommand('kDSynchronize', this._fullSync);
      return this.delay(1000).then((function(_this) {
        return function() {
          return _this._initStores();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.sendCommand('kDOperationDone');
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.delay(1000);
        };
      })(this));
    };

    NewtonDevice.prototype._initStores = function() {
      this.stores = {};
      return this.sendCommand('kDGetStoreNames').then((function(_this) {
        return function() {
          return _this.receiveCommand('kDStoreNames');
        };
      })(this)).then((function(_this) {
        return function(stores) {
          return _.reduce(stores, function(soFar, store_) {
            return soFar.then(function() {
              var store;
              store_.socket = _this.socket;
              store = _this.stores[store_.name] = new NewtonStorage(store_);
              return store.getSoups();
            });
          }, Q());
        };
      })(this));
    };

    NewtonDevice.prototype.callRootMethod = function() {
      var args, methodName;
      methodName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return this.sendCommand('kDCallRootMethod', {
        functionName: methodName,
        functionArgs: args
      }).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDCallResult');
        };
      })(this));
    };

    NewtonDevice.prototype.notifyUser = function(title, message) {
      return this.delay(500).then((function(_this) {
        return function() {
          return _this.callRootMethod('Notify', 3, title, message);
        };
      })(this));
    };

    NewtonDevice.prototype._fullSync = function() {
      return this._initFullSync().then((function(_this) {
        return function() {
          return _this.delay(8000);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.sendCommand('kDOperationDone');
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.notifyUser("Process finished", "Synchronization finished successfully");
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.sendCommand('kDOperationDone');
        };
      })(this));
    };

    NewtonDevice.prototype._initFullSync = function() {
      return this.sendCommand('kDGetSyncOptions').then((function(_this) {
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


    /**
    @method sync
     */

    NewtonDevice.prototype.initSync = function() {
      return this.sendCommand('kDDesktopControl');
    };

    NewtonDevice.prototype.finishSync = function() {
      return this.sendCommand('kDOperationDone');
    };

    NewtonDevice.prototype.getSoup = function(soupName) {
      return this.stores['Internal'].setCurrentStore().then((function(_this) {
        return function(result) {
          return _this.stores['Internal'].soups[soupName];
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
