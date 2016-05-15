(function() {
  var CommandBroker, CommandTransaction, DockCommandError, EventCommand, EventEmitter, Q, _,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('lodash');

  Q = require('q');

  EventEmitter = require('events').EventEmitter;

  EventCommand = require('./event-command');

  DockCommandError = require('./command-error');

  CommandTransaction = require('./command-transaction');

  module.exports = CommandBroker = (function() {
    _.extend(CommandBroker.prototype, EventEmitter.prototype);


    /**
      TCP socket for device comms
    @property socket
     */

    CommandBroker.prototype.socket = null;


    /**
      Timeout for command exchange. if no response or activity is detected
      machine enters on invalid state
    @property timeout
     */

    CommandBroker.prototype.timeout = 30000;


    /*
    @property transactionQueue
     */

    CommandBroker.prototype._transactionQueue = null;

    CommandBroker.prototype.currentStorage = null;

    CommandBroker.prototype.currentSoup = null;


    /**
    @class CommandBroker
    @constructor
     */

    function CommandBroker(options) {
      this._commandReceived = bind(this._commandReceived, this);
      if (options) {
        _.extend(this, _.pick(options, ['socket', 'timeout']));
      }
      this._initialize();
    }


    /**
      all init method go here
    @method initialize
     */

    CommandBroker.prototype._initialize = function() {
      var _msg;
      if (this.socket == null) {
        _msg = "CommandBroker: socket connection needed";
        throw new Error(_msg);
      } else {
        this._transactionQueue = [];
        this._processTransactionQueue();
        return this.socket.on('data', this._commandReceived);
      }
    };


    /**
    
    @method newTransaction
     */

    CommandBroker.prototype.newTransaction = function(consumerId) {
      var transaction;
      transaction = new CommandTransaction({
        socket: this.socket,
        consumerId: consumerId
      });
      this._transactionQueue.push(transaction);
      this.emit('transaction-queued');
      return transaction;
    };


    /**
    
    @method processTransactionQueue
     */

    CommandBroker.prototype._processTransactionQueue = function() {
      if (this._transactionQueue.length > 0) {
        this.currTransaction = this._transactionQueue.shift();
        return this.currTransaction.execute().fin((function(_this) {
          return function() {
            _this.currTransaction = null;
            return _this._processTransactionQueue();
          };
        })(this));
      } else {
        return this.once('transaction-queued', (function(_this) {
          return function() {
            return _this._processTransactionQueue();
          };
        })(this));
      }
    };


    /**
    
    @method commandReceived
     */

    CommandBroker.prototype._commandReceived = function(data) {
      var command, ref;
      command = EventCommand.parseFromBinary(data);
      if (command.id === 'unkn') {
        return this.emit('error', new DockCommandError({
          errorCode: -28012,
          reason: "unknown command '" + command.data.unknownCommand + "' "
        }));
      } else if (command.id === 'disc') {
        return this.emit('error', new DockCommandError({
          errorCode: -28012,
          reason: "Docking canceled"
        }));
      } else if (command.id === 'dres') {
        if (((ref = command.data) != null ? ref.errorCode : void 0) === 0) {
          return this.emitCommandReceived(command);
        } else {
          console.log(command.data);
          return this.emit('error', new DockCommandError(command.data));
        }
      } else {
        return this.emitCommandReceived(command);
      }
    };


    /**
    
    @method emitCommandReceived
     */

    CommandBroker.prototype.emitCommandReceived = function(command) {
      if (this.currTransaction != null) {
        this.currTransaction.emit('command-received', command);
      }
      return this.emit('command-received', command);
    };


    /**
    @method dispose
     */

    CommandBroker.prototype.dispose = function() {
      var i, j, len, len1, prop, properties, ref, tx;
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      this.removeAllListeners();
      ref = this._transactionQueue;
      for (i = 0, len = ref.length; i < len; i++) {
        tx = ref[i];
        tx.dispose();
      }
      properties = ['socket', '_transactionQueue'];
      for (j = 0, len1 = properties.length; j < len1; j++) {
        prop = properties[j];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return CommandBroker;

  })();

}).call(this);
