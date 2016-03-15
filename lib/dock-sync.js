
/**
  Mixing for DockSession that provides data sync features
@class DockSync
 */

(function() {
  var CommandBroker, NewtonDevice, StateMachine, Utils, _;

  _ = require('lodash');

  CommandBroker = require('./commands/command-broker');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  NewtonDevice = require('./newton-device');

  module.exports = {
    _synchronize: function() {
      console.log("syncing ...");
      return this._initSyncProcess();
    },

    /**
      Init sync process with connected device
    @method initSyncProcess
     */
    _initSyncProcess: function() {
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
          return console.log(stores);
        };
      })(this));
    }
  };

}).call(this);
