
/**
  CommandBroker
  Mixing intended to add send/receive Newton Dock Command capability to a class
  a socket property needed in order to work
 */

(function() {
  var EventCommand, Q, _;

  _ = require('lodash');

  Q = require('q');

  EventCommand = require('./event-command');

  module.exports = {

    /**
      check for socket property. checked before send or receive
    @method checkSocket
     */
    _checkSocket: function() {
      var _msg;
      if (this.socket == null) {
        _msg = "(" + this.constructor.name + "): socket connection needed";
        throw new Error(_msg);
      }
    },

    /**
      check if busy. only one receive/send operation at a time allowed 
    @method _checkProcessing
     */
    _checkProcessing: function() {
      var _msg;
      if (this.isProcessing()) {
        _msg = "(" + this.constructor.name + "): cannot process. event in process";
        throw new Error(_msg);
      }
    },

    /**
      sends a command message to Newton device
      accepts command name or ID, ex: 'kDNewtonName' or 'name'
    @method sendCommand
     */
    sendCommand: function(command, data) {
      var _bytes, data_;
      this._checkProcessing();
      this._checkSocket();
      this.processBegin();
      console.log(this.constructor.name + " send command " + command);
      command = EventCommand.parse(command, data);
      data_ = command.toBinary();
      _bytes = this.socket.write(data_);
      this.processFinish();
      return Q(_bytes);
    },
    listenForCommand: function(commandName, data, cb) {
      this._checkSocket();
      if (typeof data === 'function') {
        cb = data;
      }
      return this.socket.on('data', (function(_this) {
        return function(data) {
          var command;
          command = EventCommand.parseFromBinary(data);
          console.log(_this.constructor.name + " listening for " + commandName + ", " + command.name + " command received");
          if (commandName === 'all') {
            return cb(command);
          } else if (commandName === command.name || commandName === command.id) {
            return cb(command.data);
          }
        };
      })(this));
    },

    /**
      waits for a specific command from Newton device to arrive
      accepts command name or ID, ex: 'kDNewtonName' or 'name'
    @method receiveCommand
     */
    receiveCommand: function(commandName) {
      var deferred;
      this._checkProcessing();
      this._checkSocket();
      this.processBegin();
      deferred = Q.defer();
      console.log(this.constructor.name + " waiting for " + commandName);
      this.socket.once('data', (function(_this) {
        return function(data) {
          var command;
          command = EventCommand.parseFromBinary(data);
          console.log(_this.constructor.name + " " + command.name + " command received");
          if (commandName === command.name || commandName === command.id) {
            deferred.resolve(command.data);
          } else if (command.id === 'unkn') {
            deferred.reject({
              errorCode: -28012,
              reason: "unknown command '" + command.data.unknownCommand + "' "
            });
          } else if (command.id === 'dres') {
            console.log(command.data);
            deferred.reject(command.data);
          } else if (command.id === 'helo') {
            console.log("kDHello received. Newton is alive and connected");
            _this.receiveCommand(commandName).then(function(result) {
              return deferred.resolve(result);
            })["catch"](function(err) {
              return deferred.reject(err);
            });
          } else if (command.id === 'disc') {
            deferred.reject({
              errorCode: -28012,
              reason: "Docking canceled"
            });
          } else {
            _this.sendCommand('kDResult', {
              errorCode: -28012
            });
            deferred.reject({
              errorCode: -28012,
              reason: "Expected " + commandName + ", received " + command.name + "."
            });
          }
          return _this.processFinish();
        };
      })(this));
      return deferred.promise;
    }

    /**
    @method commandReceived
     */
  };

}).call(this);
