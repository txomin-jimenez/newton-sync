
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
      sends a command message to Newton device
      accepts command name or ID, ex: 'kDNewtonName' or 'name'
    @method sendCommand
     */
    sendCommand: function(command, data) {
      var data_;
      this._checkSocket();
      console.log("send command " + command);
      command = EventCommand.parse(command, data);
      data_ = command.toBinary();
      return Q(this.socket.write(data_));
    },

    /**
      waits for a specific command from Newton device to arrive
      accepts command name or ID, ex: 'kDNewtonName' or 'name'
    @method receiveCommand
     */
    receiveCommand: function(commandName) {
      var deferred;
      console.log("receiveCommand " + commandName);
      this._checkSocket();
      deferred = Q.defer();
      console.log("waiting for " + commandName);
      this.socket.once('data', (function(_this) {
        return function(data) {
          var command;
          command = EventCommand.parseFromBinary(data);
          console.log(command.name + " command received");
          if (command.id === 'dres') {
            console.log(command.data);
          }
          if (commandName === command.name || commandName === command.id) {
            return deferred.resolve(command.data);
          }
        };
      })(this));
      return deferred.promise;
    }

    /**
    @method commandReceived
     */
  };

}).call(this);
