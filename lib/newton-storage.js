
/**
@class NewtonStorage
 */

(function() {
  var CommandConsumer, NewtonSoup, NewtonStorage, Q, StateMachine, Utils, _, net;

  Q = require('q');

  _ = require('lodash');

  net = require('net');

  CommandConsumer = require('./commands/command-consumer');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  NewtonSoup = require('./newton-soup');

  module.exports = NewtonStorage = (function() {

    /**
      commandBroker instance for command exchange
    @property commandBroker
     */
    NewtonStorage.prototype.commandBroker = null;


    /**
    @property name
     */

    NewtonStorage.prototype.name = null;


    /**
      Internal identifier
    @property signature
     */

    NewtonStorage.prototype.signature = null;


    /**
      Storage size in bytes  
    @property totalSize
     */

    NewtonStorage.prototype.totalSize = null;


    /**
      Used storage in bytes 
    @property usedSize
     */

    NewtonStorage.prototype.usedSize = null;


    /**
      Storage kind: (Internal/External) 
    @property kind
     */

    NewtonStorage.prototype.kind = null;


    /**
      Storage info 
    @property info
     */

    NewtonStorage.prototype.info = null;


    /**
      Write protection 
    @property readOnly
     */

    NewtonStorage.prototype.readOnly = null;


    /**
      password protected storage 
    @property storePassword
     */

    NewtonStorage.prototype.storePassword = null;


    /**
      Store is default store for new entries 
    @property defaultStore
     */

    NewtonStorage.prototype.defaultStore = null;


    /**
      store revision identifier 
    @property storeVersion
     */

    NewtonStorage.prototype.storeVersion = null;


    /**
    @class NewtonStorage
    @constructor
     */

    function NewtonStorage(options) {
      if (options.TotalSize != null) {
        options.totalSize = options.TotalSize;
      }
      if (options.UsedSize != null) {
        options.usedSize = options.UsedSize;
      }
      if (options.storepassword != null) {
        options.storePassword = options.storepassword;
      }
      if (options.storeversion != null) {
        options.storeVersion = options.storeversion;
      }
      if (options) {
        _.extend(this, _.pick(options, ['commandBroker', 'name', 'signature', 'totalSize', 'usedSize', 'kind', 'info', 'readOnly', 'storePassword', 'defaultStore', 'storeVersion']));
      }
      _.extend(this, StateMachine);
      _.extend(this, CommandConsumer);
      this._initialize(options);
    }


    /**
      all init method go here
    @method initialize
     */

    NewtonStorage.prototype._initialize = function(options) {
      return null;
    };


    /**
      Load soup names from device and initialize instances for later use
    @method initSoups
     */

    NewtonStorage.prototype.initSoups = function() {
      var storeFrame, tx;
      tx = this.newCommandTransaction();
      storeFrame = this.toFrame();
      this.soups = {};
      return tx.sendCommand('kDSetStoreGetNames', storeFrame).then(function() {
        return tx.receiveCommand('kDSoupNames');
      }).then((function(_this) {
        return function(soups_) {
          _this.commandBroker.currentStorage = _this.name;
          tx.finish();
          return _.reduce(soups_, function(soFar, soupName) {
            return soFar.then(function() {
              var soup;
              if (soupName !== 'Packages') {
                soup = _this.soups[soupName] = new NewtonSoup({
                  name: soupName,
                  commandBroker: _this.commandBroker
                });
                return soup.loadSoupInfo();
              } else {
                return Q();
              }
            });
          }, Q());
        };
      })(this));
    };


    /**
      Set store as current before soup operations
    @method setCurrentStore
     */

    NewtonStorage.prototype.setCurrentStore = function(tx) {
      var storeFrame;
      if (this.commandBroker.currentStorage === this.name) {
        return Q();
      } else {
        storeFrame = this.toFrame();
        return tx.sendCommand('kDSetCurrentStore', storeFrame).then(function() {
          return tx.receiveCommand('kDResult');
        }).then((function(_this) {
          return function(result) {
            if ((result != null ? result.errorCode : void 0) !== 0) {
              throw new Error("error " + result.errorCode + " setting current store.");
            } else {
              _this.commandBroker.currentStorage = _this.name;
            }
            return null;
          };
        })(this));
      }
    };


    /**
      Store frame representation as needed for Newton command exchange 
    @method toFrame
     */

    NewtonStorage.prototype.toFrame = function() {
      return {
        name: this.name,
        kind: this.kind,
        signature: this.signature
      };
    };


    /**
    @method dispose
     */

    NewtonStorage.prototype.dispose = function() {
      var i, j, len, len1, prop, properties, ref, soup;
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      this.removeAllListeners();
      if (this.soups != null) {
        ref = this.soups;
        for (i = 0, len = ref.length; i < len; i++) {
          soup = ref[i];
          soup.dispose();
        }
      }
      properties = ['socket', 'name', 'signature', 'totalSize', 'usedSize', 'kind', 'info', 'readOnly', 'storePassword', 'defaultStore', 'storeVersion', 'soups'];
      for (j = 0, len1 = properties.length; j < len1; j++) {
        prop = properties[j];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return NewtonStorage;

  })();

}).call(this);
