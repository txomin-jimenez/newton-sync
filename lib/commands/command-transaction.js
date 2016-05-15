(function() {
  var CommandTransaction, DockCommandError, EventCommand, EventEmitter, FINISH, Q, READY, RECEIVE, SEND, STATE_CHANGE, _,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  Q = require('q');

  EventEmitter = require('events').EventEmitter;

  EventCommand = require('./event-command');

  DockCommandError = require('./command-error');

  READY = 'ready';

  SEND = 'sending';

  RECEIVE = 'receiving';

  FINISH = 'finished';

  STATE_CHANGE = 'state_change';

  module.exports = CommandTransaction = (function() {
    _.extend(CommandTransaction.prototype, EventEmitter.prototype);


    /**
      TCP socket for device comms
    @property socket
     */

    CommandTransaction.prototype.socket = null;


    /**
      current transaction state
    @property state
    @private
     */

    CommandTransaction.prototype._state = null;


    /**
      previous transaction state
    @property prevState
    @private
     */

    CommandTransaction.prototype._prevState = null;


    /**
      transaction commands queue. all commands are queued and processed one
      at a time
    @property commandQueue
    @private
     */

    CommandTransaction.prototype._commandQueue = null;


    /**
    @class CommandTransaction
    @constructor
     */

    function CommandTransaction(options) {
      if (options) {
        _.extend(this, _.pick(options, ['socket', 'consumerId']));
      }
      this.cid = _.uniqueId('tx-');
      this._initialize();
    }


    /**
      all init method go here
    @method initialize
     */

    CommandTransaction.prototype._initialize = function() {
      var _msg;
      if (this.socket == null) {
        _msg = "CommandTransaction: socket connection needed";
        throw new Error(_msg);
      } else {
        this._commandQueue = [];
        return this._processReady();
      }
    };


    /**
    
    @method state
     */

    CommandTransaction.prototype.state = function() {
      return this._state;
    };


    /**
    
    @method isReady
     */

    CommandTransaction.prototype.isReady = function() {
      return this._state === READY;
    };


    /**
    
    @method isProcessing
     */

    CommandTransaction.prototype.isProcessing = function() {
      var ref;
      return (ref = this._state) === SEND || ref === RECEIVE;
    };


    /**
    
    @method isFinished
     */

    CommandTransaction.prototype.isFinished = function() {
      return this._state === FINISH;
    };


    /**
    
    @method processReady
     */

    CommandTransaction.prototype._processReady = function() {
      this._prevState = this._state;
      this._state = READY;
      this.emit(READY, this, this._state);
      return this.emit(STATE_CHANGE, this, this._state);
    };


    /**
    
    @method processSend
     */

    CommandTransaction.prototype._processSend = function() {
      this._prevState = this._state;
      this._state = SEND;
      this.emit(SEND, this, this._state);
      return this.emit(STATE_CHANGE, this, this._state);
    };


    /**
    
    @method processReceive
     */

    CommandTransaction.prototype._processReceive = function() {
      this._prevState = this._state;
      this._state = RECEIVE;
      this.emit(RECEIVE, this, this._state);
      return this.emit(STATE_CHANGE, this, this._state);
    };


    /**
    
    @method processFinish
     */

    CommandTransaction.prototype._processFinish = function() {
      this._prevState = this._state;
      this._state = FINISH;
      this.emit(FINISH, this, this._state);
      return this.emit(STATE_CHANGE, this, this._state);
    };


    /**
    
    @method execute
     */

    CommandTransaction.prototype.execute = function() {
      this._processCommandQueue();
      return this.whenFinished();
    };


    /**
    
    @method finish
     */

    CommandTransaction.prototype.finish = function() {
      var deferred;
      deferred = Q.defer();
      this._queueCommand('finish_process', null, null, deferred);
      return deferred.promise;
    };


    /**
    
    @method whenReady
     */

    CommandTransaction.prototype.whenReady = function() {
      var deferred;
      if (this.isReady()) {
        return Q();
      } else {
        deferred = Q.defer();
        this.once(READY, function() {
          return deferred.resolve();
        });
        return deferred.promise;
      }
    };


    /**
    
    @method whenFinished
     */

    CommandTransaction.prototype.whenFinished = function() {
      var deferred;
      if (this.isFinished()) {
        return Q();
      } else {
        deferred = Q.defer();
        this.once(FINISH, function() {
          return deferred.resolve();
        });
        return deferred.promise;
      }
    };


    /**
    
    @method sendCommand
     */

    CommandTransaction.prototype.sendCommand = function(command, data) {
      var deferred;
      deferred = Q.defer();
      this._queueCommand('send', command, data, deferred);
      return deferred.promise;
    };


    /**
      wait X milliseconds asynchronously. Sometimes we need to wait a bit, if
      we go too fast process could fail
    @method delay
     */

    CommandTransaction.prototype.delay = function(delayMs) {
      var deferred, xx;
      deferred = Q.defer();
      xx = setTimeout(function() {
        return deferred.resolve();
      }, delayMs);
      return deferred.promise;
    };


    /**
    
    @method receiveCommand
     */

    CommandTransaction.prototype.receiveCommand = function(commandName) {
      var deferred;
      deferred = Q.defer();
      this._queueCommand('receive', commandName, null, deferred);
      return deferred.promise;
    };


    /**
    
    @method queueCommand
     */

    CommandTransaction.prototype._queueCommand = function(action, command, data, deferred) {
      this._commandQueue.push({
        action: action,
        command: command,
        data: data,
        deferred: deferred
      });
      return this.emit('command-queued');
    };


    /**
    
    @method processCommandQueue
     */

    CommandTransaction.prototype._processCommandQueue = function() {
      var comm;
      if (this.isFinished()) {
        return;
      }
      if (this._commandQueue.length > 0) {
        comm = this._commandQueue.shift();
        return (comm.action === 'send' ? this._sendCommand(comm.command, comm.data) : comm.action === 'receive' ? this._receiveCommand(comm.command) : (this._finishTransaction(), Q())).then((function(_this) {
          return function(result) {
            comm.deferred.resolve(result);
            return _this._processCommandQueue();
          };
        })(this))["catch"]((function(_this) {
          return function(err) {
            comm.deferred.reject(err);
            return _this._finishTransaction();
          };
        })(this));
      } else {
        return this.once('command-queued', (function(_this) {
          return function() {
            return _this._processCommandQueue();
          };
        })(this));
      }
    };


    /**
      sends a command message to Newton device via tcp socket
      accepts command name or ID, ex: 'kDNewtonName' or 'name'
    @method sendCommand
     */

    CommandTransaction.prototype._sendCommand = function(command, data) {
      var deferred, send_;
      deferred = Q.defer();
      send_ = (function(_this) {
        return function() {
          var data_;
          _this._processSend();
          command = EventCommand.parse(command, data);
          data_ = command.toBinary();
          return _this.socket.write(data_, function() {
            deferred.resolve();
            _this._processReady();
            return command.dispose();
          });
        };
      })(this);
      if (this._prevState === SEND) {
        setTimeout(function() {
          return send_();
        }, 10);
      } else {
        send_();
      }
      return deferred.promise;
    };


    /**
      waits for a specific command from Newton device to arrive
      accepts command name or ID, ex: 'kDNewtonName' or 'name'
      event commands are sent by CommandBroker that handles transaction
    @method receiveCommand
     */

    CommandTransaction.prototype._receiveCommand = function(commandName) {
      var deferred;
      this._processReceive();
      deferred = Q.defer();
      this.once('command-received', (function(_this) {
        return function(command) {
          var ref;
          _this._processReady();
          if (commandName instanceof Array && (ref = command.name, indexOf.call(commandName, ref) >= 0)) {
            return deferred.resolve(command);
          } else if (commandName === command.name || commandName === command.id) {
            return deferred.resolve(command.data);
          } else {
            _this._sendCommand('kDResult', {
              errorCode: -28012
            });
            return deferred.reject(new DockCommandError({
              errorCode: -28012,
              reason: "(" + _this.consumerId + " - " + _this.cid + ") - Expected " + commandName + ", received " + command.name + "."
            }));
          }
        };
      })(this));
      return deferred.promise;
    };


    /**
    
    @method finishTransaction
     */

    CommandTransaction.prototype._finishTransaction = function() {
      this._processFinish();
      return this.dispose();
    };


    /**
    @method dispose
     */

    CommandTransaction.prototype.dispose = function() {
      var comm, i, j, len, len1, prop, properties, ref;
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      this.removeAllListeners();
      ref = this._commandQueue;
      for (i = 0, len = ref.length; i < len; i++) {
        comm = ref[i];
        comm.data = null;
        comm.deferred = null;
      }
      properties = ['socket', '_commandQueue'];
      for (j = 0, len1 = properties.length; j < len1; j++) {
        prop = properties[j];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return CommandTransaction;

  })();

}).call(this);
