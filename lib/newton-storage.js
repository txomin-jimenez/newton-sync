
/**
@class NewtonStorage
 */

(function() {
  var CommandBroker, NewtonStorage, Q, StateMachine, Utils, _, net;

  Q = require('q');

  _ = require('lodash');

  net = require('net');

  CommandBroker = require('./commands/command-broker');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  module.exports = NewtonStorage = (function() {

    /**
      TCP socket for device comms
    @property socket
     */
    NewtonStorage.prototype.socket = null;


    /**
    @property name
     */

    NewtonStorage.prototype.name = null;


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
        _.extend(this, _.pick(options, ['socket', 'name', 'signature', 'totalSize', 'usedSize', 'kind', 'info', 'readOnly', 'storePassword', 'defaultStore', 'storeVersion']));
      }
      _.extend(this, StateMachine);
      _.extend(this, CommandBroker);
      this._initialize(options);
    }


    /**
      all init method go here
    @method initialize
     */

    NewtonStorage.prototype._initialize = function(options) {};

    NewtonStorage.prototype.toFrame = function() {
      return {
        name: this.name,
        kind: this.kind,
        signature: this.signature
      };
    };

    NewtonStorage.prototype.getSoups = function() {
      var frame;
      console.log("getSoups...");
      frame = this.toFrame();
      console.log(frame);
      return this.sendCommand('kDSetStoreGetNames', frame).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDSoupNames');
        };
      })(this)).then((function(_this) {
        return function(soups_) {
          console.log("soup info");
          return console.log(soups_);
        };
      })(this));
    };


    /**
    @method dispose
     */

    NewtonStorage.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      this.removeAllListeners();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return NewtonStorage;

  })();

}).call(this);
