
/**
@class NewtonSoup
 */

(function() {
  var CommandBroker, NewtonSoup, Q, StateMachine, Utils, _, net;

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

    NewtonSoup.prototype.allEntries = function(processEntryFn) {
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
          return _this.listenForCommand('kDEntry', null, processEntryFn, 'kDBackupSoupDone');
        };
      })(this));
    };

    NewtonSoup.prototype.getEntryById = function(docId) {
      return this.sendCommand('kDSetCurrentSoup', this.name).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDResult');
        };
      })(this)).then((function(_this) {
        return function(result_) {
          return _this.sendCommand('kDReturnEntry', docId);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDEntry');
        };
      })(this));
    };

    NewtonSoup.prototype.addEntry = function(entryData) {
      return this.sendCommand('kDSetCurrentSoup', this.name).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDResult');
        };
      })(this)).then((function(_this) {
        return function(result_) {
          return _this.sendCommand('kDAddEntry', entryData);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDAddedID');
        };
      })(this));
    };

    NewtonSoup.prototype.deleteEntry = function(entryIds) {
      if (entryIds.length == null) {
        entryIds = [entryIds];
      }
      return this.sendCommand('kDSetCurrentSoup', this.name).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDResult');
        };
      })(this)).then((function(_this) {
        return function(result_) {
          return _this.sendCommand('kDDeleteEntries', entryIds);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDResult');
        };
      })(this));
    };


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
