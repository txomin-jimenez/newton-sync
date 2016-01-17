###*
  StateMachine
  Simple finite state machine for command exchange
  Three states: ready, processing, finished 
  Fires events on every transition
  Provides methods to handle state and process actions
###
_                 = require 'lodash'

EventEmitter      = require('events').EventEmitter

READY = 'ready'
PROCESSING = 'processing'
FINISHED = 'finished'

STATE_CHANGE = 'stateChange'

StateMachine =

  _state: null
  _prevState: null

  state: ->
    @_state

  isReady: ->
    @_state is READY
  
  isProcessing: ->
    @_state is PROCESSING
  
  isFinished: ->
    @_state is FINISHED
  
  isFinishedWithError: ->
    @_state is FINISHED and @_lastError?

  processReady: ->
    if @_state in [PROCESSING, FINISHED]
      @_prevState = @_state
      @_state = READY
      @emit @_state, this, @_state
      @emit STATE_CHANGE, this, @_state
    # when READY do nothing
    return

  processBegin: ->
    if @_state in [READY, FINISHED]
      @_prevState = @_state
      @_state = PROCESSING
      @_lastError = null
      @emit trigger @_state, this, @_state
      @emit STATE_CHANGE, this, @_state
    # when PROCESSING do nothing
    return

  processFinish: (error) ->
    if @_state is PROCESSING
      @_prevState = @_state
      @_state = FINISHED
      @_lastError = error
      @emit @_state, this, @_state
      @emit STATE_CHANGE, this, @_state
    # when READY, FINISHED do nothing  
    return

  processAbort: ->
    if @_state is PROCESSING
      @_state = @_prevState
      @_prevState = @_state
      @emit @_state, this, @_state
      @emit STATE_CHANGE, this, @_state
    # when READY, FINISHED do nothing  
    return

# event emit capability
_.extend StateMachine, EventEmitter.prototype

# You’re frozen when your heart’s not open.
Object.freeze? StateMachine

module.exports = StateMachine
