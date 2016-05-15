
/**
  CommandConsumer
 */

(function() {
  var EventCommand, Q, _;

  _ = require('lodash');

  Q = require('q');

  EventCommand = require('./event-command');


  /**
    Return mixing intended to add send/receive Newton Dock Command capability to a
    class.
   */

  module.exports = {

    /**
      check for CommandBroker instance property. This broker handles all
      command comunication for a session
    @method checkCommandBroker
    @private
     */
    _checkCommandBroker: function() {
      var _msg;
      if (this.commandBroker == null) {
        _msg = "(" + this.constructor.name + "): Command Broker needed.";
        throw new Error(_msg);
      }
    },

    /**
      open new transaction for command exchange
    @method newCommandTransaction
     */
    newCommandTransaction: function() {
      this._checkCommandBroker();
      return this.commandBroker.newTransaction(this.constructor.name);
    },
    sendCommand: function(command, data) {
      var tx;
      this._checkCommandBroker();
      tx = this.commandBroker.newTransaction(this.constructor.name);
      return tx.sendCommand(command, data).then(function(result) {
        tx.finish();
        return result;
      });
    },
    receiveCommand: function(commandName) {
      var tx;
      this._checkCommandBroker();
      tx = this.commandBroker.newTransaction(this.constructor.name);
      return tx.receiveCommand(command).then(function(result) {
        tx.finish();
        return result;
      });
    },

    /**
      wait X milliseconds asynchronously. Sometimes we need to wait a bit, if
      we go too fast process could fail
    @method delay
     */
    delay: function(delayMs) {
      var deferred, xx;
      deferred = Q.defer();
      xx = setTimeout(function() {
        return deferred.resolve();
      }, delayMs);
      return deferred.promise;
    }
  };

}).call(this);
