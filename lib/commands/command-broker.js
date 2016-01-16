
/**
  CommandBroker
  Mixing intended to add send/receive Newton Dock Command capability to a class
  a socket property needed in order to work
 */

(function() {
  var Q, StateMachine, _;

  _ = require('lodash');

  Q = require('q');

  StateMachine = require('./state-machine');

  module.exports = {

    /**
      TCP socket for device comms
    @property socket
     */
    socket: null,

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
      this._checkSocket();
      command = EventCommand.parse(command, data);
      return this.socket.write(command.toBinary());
    },

    /**
      waits for a specific command from Newton device to arrive
      accepts command name or ID, ex: 'kDNewtonName' or 'name'
    @method receiveCommand
     */
    receiveCommand: function(commandName) {
      var deferred;
      this._checkSocket();
      deferred = Q.defer();
      this.socket.once('data', (function(_this) {
        return function(data) {
          var command;
          command = EventCommand.parseFromBinary(data);
          if (commandName === command.name || commandName === command.id) {
            return deferred.resolve(command);
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
