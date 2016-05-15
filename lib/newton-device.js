
/**
  Handle all Newton Device information related command and process.
@class NewtonDevice
 */

(function() {
  var CommandConsumer, EventEmitter, NewtonDevice, NewtonStorage, Q, Utils, _, net,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  Q = require('q');

  _ = require('lodash');

  net = require('net');

  EventEmitter = require('events').EventEmitter;

  CommandConsumer = require('./commands/command-consumer');

  Utils = require('./utils');

  NewtonStorage = require('./newton-storage');

  module.exports = NewtonDevice = (function() {
    _.extend(NewtonDevice.prototype, EventEmitter.prototype);


    /**
      commandBroker instance for command exchange
    @property commandBroker
     */

    NewtonDevice.prototype.commandBroker = null;


    /**
      Received Newton device name
    @property name
     */

    NewtonDevice.prototype.name = null;


    /**
      A unique id to identify a particular newton
    @property fNewtonID
     */

    NewtonDevice.prototype.fNewtonID = null;


    /**
      A decimal integer indicating the manufacturer of the device
    @property fManufacturer
     */

    NewtonDevice.prototype.fManufacturer = null;


    /**
      A decimal integer indicating the hardware type of the device
    @property fMachineType
     */

    NewtonDevice.prototype.fMachineType = null;


    /**
      A decimal number indicating the major and minor ROM version numbers
      The major number is in front of the decimal, the minor number after
    @property fROMVersion
     */

    NewtonDevice.prototype.fROMVersion = null;


    /**
      A decimal integer indicating the language (English, German, French)
      and the stage of the ROM (alpha, beta, final)
    @property fROMStage
     */

    NewtonDevice.prototype.fROMStage = null;


    /**
      Device RAM size in bytes
    @property fRAMSize
     */

    NewtonDevice.prototype.fRAMSize = null;


    /**
      An integer representing the height of the screen in pixels
    @property fScreenHeight
     */

    NewtonDevice.prototype.fScreenHeight = null;


    /**
      An integer representing the width of the screen in pixels
    @property fScreenWidth
     */

    NewtonDevice.prototype.fScreenWidth = null;


    /**
      0 on an unpatched Newton and nonzero on a patched Newton
    @property fPatchVersion
     */

    NewtonDevice.prototype.fPatchVersion = null;


    /**
      Device's NewtonOS version
    @property fNOSVersion
     */

    NewtonDevice.prototype.fNOSVersion = null;


    /**
      Signature (internal identifier) of the internal store
    @property fInternalStoreSig
     */

    NewtonDevice.prototype.fInternalStoreSig = null;


    /**
      An integer representing the number of vertical pixels per inch
    @property fScreenResolutionV
     */

    NewtonDevice.prototype.fScreenResolutionV = null;


    /**
      An integer representing the number of horizontal pixels per inch
    @property fScreenResolutionH
     */

    NewtonDevice.prototype.fScreenResolutionH = null;


    /**
      The bit depth of the LCD screen
    @property fScreenDepth
     */

    NewtonDevice.prototype.fScreenDepth = null;


    /**
      various System bit flags
      1 = has serial number
      2 = has target protocol
    @property fSystemFlags
     */

    NewtonDevice.prototype.fSystemFlags = null;


    /**
      Device serial number if present
    @property fSerialNumber
     */

    NewtonDevice.prototype.fSerialNumber = null;


    /**
      Target protocol if present
    @property fTargetProtocol
     */

    NewtonDevice.prototype.fTargetProtocol = null;


    /**
    @class NewtonDevice
    @constructor
     */

    function NewtonDevice(options) {
      this._fullSync = bind(this._fullSync, this);
      if (options) {
        _.extend(this, _.pick(options, ['commandBroker', 'fNewtonID', 'fManufacturer', 'fMachineType', 'fROMVersion', 'fROMStage', 'fRAMSize', 'fScreenWidth', 'fScreenWidth', 'fPatchVersion', 'fNOSVersion', 'fInternalStoreSig', 'fScreenResolutionV', 'fScreenResolutionH', 'fScreenDepth', 'fSystemFlags', 'fSerialNumber', 'fTargetProtocol', 'name', 'protocolVersion', 'encryptedKey1', 'encryptedKey2']));
      }
      _.extend(this, CommandConsumer);
      this._initialize(options);
    }


    /**
      all init method go here
    @method initialize
     */

    NewtonDevice.prototype._initialize = function(options) {
      return null;
    };


    /**
      Return a object with device info
    @method info
     */

    NewtonDevice.prototype.info = function() {
      return _.pick(this, ['fNewtonID', 'fManufacturer', 'fMachineType', 'fROMVersion', 'fROMStage', 'fRAMSize', 'fScreenWidth', 'fScreenWidth', 'fPatchVersion', 'fNOSVersion', 'fInternalStoreSig', 'fScreenResolutionV', 'fScreenResolutionH', 'fScreenDepth', 'fSystemFlags', 'fSerialNumber', 'fTargetProtocol', 'name']);
    };


    /**
      Get encryption keys used for session password exchange
    @method getEncryptedKeys
     */

    NewtonDevice.prototype.getEncryptedKeys = function() {
      return _.pick(this, ['encryptedKey1', 'encryptedKey2']);
    };


    /**
      Init device for sync session. used in session init. Storage and Soup info
      is pre-fetched for later sync process use
    @method initSyncSession
     */

    NewtonDevice.prototype.initSyncSession = function() {
      return setTimeout((function(_this) {
        return function() {
          return _this._initStores().then(function() {
            var sessionTx;
            sessionTx = this.newCommandTransaction();
            return sessionTx.sendCommand('kDOperationDone');
          }).then(function() {
            return sessionTx.delay(1000);
          }).then(function() {
            return sessionTx.finish();
          });
        };
      })(this), 1000);
    };


    /**
      Load store names from device and initialize instances to handle them
    @method initStores
    @private
     */

    NewtonDevice.prototype._initStores = function() {
      var tx;
      tx = this.newCommandTransaction();
      this.stores = {};
      return tx.sendCommand('kDGetStoreNames').then(function() {
        return tx.receiveCommand('kDStoreNames');
      }).then((function(_this) {
        return function(stores) {
          tx.finish();
          return _.reduce(stores, function(soFar, store_) {
            return soFar.then(function() {
              var store;
              store_.commandBroker = _this.commandBroker;
              store = _this.stores[store_.name] = new NewtonStorage(store_);
              return store.initSoups();
            });
          }, Q());
        };
      })(this));
    };


    /**
     */

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


    /**
      Negotiate sync process with Newton device
    @method initFullSync
     */

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
      })(this)).then(function(newtonTime) {
        console.log("Newton time: ");
        return console.log(newtonTime);
      });
    };

    NewtonDevice.prototype.getSoup = function(soupName) {
      return this.stores['Internal'].setCurrentStore().then((function(_this) {
        return function(result) {
          return _this.stores['Internal'].soups[soupName];
        };
      })(this));
    };

    NewtonDevice.prototype.appNames = function() {
      var tx;
      tx = this.newCommandTransaction();
      return tx.sendCommand("kDGetAppNames").then(function() {
        return tx.receiveCommand("kDAppNames");
      }).then(function(appNames) {
        tx.sendCommand('kDOperationDone');
        tx.finish();
        return appNames;
      });
    };

    NewtonDevice.prototype.callRootMethod = function() {
      var args, methodName, tx;
      methodName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      tx = this.newCommandTransaction();
      return tx.sendCommand('kDCallRootMethod', {
        functionName: methodName,
        functionArgs: args
      }).then(function() {
        return tx.receiveCommand('kDCallResult');
      }).then(function(result) {
        tx.finish();
        return result;
      });
    };

    NewtonDevice.prototype.notifyUser = function(title, message) {
      var tx;
      tx = this.newCommandTransaction();
      return setTimeout((function(_this) {
        return function() {
          return _this.callRootMethod('Notify', 3, title, message);
        };
      })(this), 500);
    };


    /**
    @method dispose
     */

    NewtonDevice.prototype.dispose = function() {
      var i, j, len, len1, prop, properties, ref, store;
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      this.removeAllListeners();
      if (this.stores != null) {
        ref = this.stores;
        for (i = 0, len = ref.length; i < len; i++) {
          store = ref[i];
          store.dispose();
        }
      }
      properties = ['commandBroker', 'stores'];
      for (j = 0, len1 = properties.length; j < len1; j++) {
        prop = properties[j];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return NewtonDevice;

  })();

}).call(this);
