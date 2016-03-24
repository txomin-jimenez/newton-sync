
/**
@class NewtonSoup
 */

(function() {
  var CommandBroker, NewtonSoup, Q, StateMachine, Utils, _, net,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Q = require('q');

  _ = require('lodash');

  net = require('net');

  CommandBroker = require('./commands/command-broker');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  module.exports = NewtonSoup = (function() {

    /**
      TCP socket for device comms
    @property socket
     */
    NewtonSoup.prototype.socket = null;


    /**
    @property name
     */

    NewtonSoup.prototype.name = null;

    NewtonSoup.prototype.signature = null;

    NewtonSoup.prototype.totalSize = null;

    NewtonSoup.prototype.usedSize = null;

    NewtonSoup.prototype.kind = null;

    NewtonSoup.prototype.info = null;

    NewtonSoup.prototype.readOnly = null;

    NewtonSoup.prototype.storePassword = null;

    NewtonSoup.prototype.defaultStore = null;

    NewtonSoup.prototype.storeVersion = null;


    /**
    @class NewtonStorage
    @constructor
     */

    function NewtonSoup(options) {
      this.processEntry = bind(this.processEntry, this);
      if (options) {
        _.extend(this, _.pick(options, ['socket', 'name']));
      }
      _.extend(this, StateMachine);
      _.extend(this, CommandBroker);
      this._initialize(options);
    }


    /**
      all init method go here
    @method initialize
     */

    NewtonSoup.prototype._initialize = function(options) {};

    NewtonSoup.prototype.sync = function() {
      console.log(".....................................sync " + this.name + " ...");
      this.entries = {};
      return this.sendCommand('kDSetCurrentSoup', this.name).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDResult');
        };
      })(this)).then((function(_this) {
        return function(result_) {
          return _this.sendCommand('kDSendSoup');
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.listenForCommand('kDEntry', null, _this.processEntry, 'kDBackupSoupDone');
        };
      })(this));
    };

    NewtonSoup.prototype.processEntry = function(entryData) {
      var entryID;
      entryID = entryData._uniqueID;
      if (entryID != null) {
        console.log("(" + this.name + ") processEntry: " + entryID);
        return this.entries[entryID] = entryData;
      } else {
        console.log("invalid entry?:");
        return console.log(entryData);
      }
    };

    NewtonSoup.prototype.toFrame = function() {};


    /**
    @method dispose
     */

    NewtonSoup.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      this.removeAllListeners();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return NewtonSoup;

  })();

}).call(this);
