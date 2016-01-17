
/**
  StateMachine
  Simple finite state machine for command exchange
  Three states: ready, processing, finished 
  Fires events on every transition
  Provides methods to handle state and process actions
 */

(function() {
  var EventEmitter, FINISHED, PROCESSING, READY, STATE_CHANGE, StateMachine, _;

  _ = require('lodash');

  EventEmitter = require('events').EventEmitter;

  READY = 'ready';

  PROCESSING = 'processing';

  FINISHED = 'finished';

  STATE_CHANGE = 'stateChange';

  StateMachine = {
    _state: null,
    _prevState: null,
    state: function() {
      return this._state;
    },
    isReady: function() {
      return this._state === READY;
    },
    isProcessing: function() {
      return this._state === PROCESSING;
    },
    isFinished: function() {
      return this._state === FINISHED;
    },
    isFinishedWithError: function() {
      return this._state === FINISHED && (this._lastError != null);
    },
    processReady: function() {
      var ref;
      if ((ref = this._state) === PROCESSING || ref === FINISHED) {
        this._prevState = this._state;
        this._state = READY;
        this.emit(this._state, this, this._state);
        this.emit(STATE_CHANGE, this, this._state);
      }
    },
    processBegin: function() {
      var ref;
      if ((ref = this._state) === READY || ref === FINISHED) {
        this._prevState = this._state;
        this._state = PROCESSING;
        this._lastError = null;
        this.emit(trigger(this._state, this, this._state));
        this.emit(STATE_CHANGE, this, this._state);
      }
    },
    processFinish: function(error) {
      if (this._state === PROCESSING) {
        this._prevState = this._state;
        this._state = FINISHED;
        this._lastError = error;
        this.emit(this._state, this, this._state);
        this.emit(STATE_CHANGE, this, this._state);
      }
    },
    processAbort: function() {
      if (this._state === PROCESSING) {
        this._state = this._prevState;
        this._prevState = this._state;
        this.emit(this._state, this, this._state);
        this.emit(STATE_CHANGE, this, this._state);
      }
    }
  };

  _.extend(StateMachine, EventEmitter.prototype);

  if (typeof Object.freeze === "function") {
    Object.freeze(StateMachine);
  }

  module.exports = StateMachine;

}).call(this);
