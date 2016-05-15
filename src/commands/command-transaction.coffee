_                 = require 'lodash'
Q                 = require 'q'
EventEmitter      = require('events').EventEmitter

EventCommand      = require './event-command'
DockCommandError  = require './command-error'

# Transaction states
READY = 'ready'
SEND = 'sending'
RECEIVE = 'receiving'
FINISH = 'finished'
STATE_CHANGE = 'state_change'

module.exports = class CommandTransaction
  
  # event emit feature
  _.extend @prototype, EventEmitter.prototype
  
  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
    current transaction state 
  @property state
  @private
  ###
  _state: null
  
  ###*
    previous transaction state 
  @property prevState
  @private
  ###
  _prevState: null

  ###*
    transaction commands queue. all commands are queued and processed one
    at a time
  @property commandQueue
  @private
  ###
  _commandQueue: null

  
  ###*
  @class CommandTransaction
  @constructor
  ###
  constructor: (options) ->

    if options
      _.extend this, _.pick options, [
        'socket'
        'consumerId'
      ]

    @cid = _.uniqueId 'tx-'
      
    @_initialize()

  ###*
    all init method go here
  @method initialize
  ###
  _initialize: ->
    
    if not @socket?
      _msg = "CommandTransaction: socket connection needed"
      throw new Error _msg
    else
      @_commandQueue = []
      @_processReady()

  ###*
  
  @method 
  ###
  state: ->
    @_state

  ###*
  
  @method 
  ###
  isReady: ->
    @_state is READY

  ###*
  
  @method 
  ###
  isProcessing: ->
    @_state in [SEND, RECEIVE]
  
  ###*
  
  @method 
  ###
  isFinished: ->
    @_state is FINISH
  
  ###*
  
  @method 
  ###
  _processReady: ->
    @_prevState = @_state
    @_state = READY
    @emit READY, this, @_state
    @emit STATE_CHANGE, this, @_state
  
  ###*
  
  @method 
  ###
  _processSend: ->
    @_prevState = @_state
    @_state = SEND
    @emit SEND, this, @_state
    @emit STATE_CHANGE, this, @_state

  ###*
  
  @method 
  ###
  _processReceive: ->
    @_prevState = @_state
    @_state = RECEIVE
    @emit RECEIVE, this, @_state
    @emit STATE_CHANGE, this, @_state
  
  ###*
  
  @method 
  ###
  _processFinish: ->
    @_prevState = @_state
    @_state = FINISH
    @emit FINISH, this, @_state
    @emit STATE_CHANGE, this, @_state

  ###*
  
  @method 
  ###
  execute: ->
    @_processCommandQueue()
    
    # return finish promise
    @whenFinished()
  
  ###*
  
  @method 
  ###
  finish: ->

    deferred = Q.defer()
    
    # queue special task to the end of queue. remaining tasks will be processed
    # before end transaction
    @_queueCommand('finish_process', null, null, deferred)
    
    deferred.promise

  ###*
  
  @method 
  ###
  whenReady: ->

    if @isReady()
      Q()
    else
      deferred = Q.defer()

      @once READY, ->
        deferred.resolve()

      deferred.promise
  
  ###*
  
  @method 
  ###
  whenFinished: ->

    if @isFinished()
      Q()
    else
      deferred = Q.defer()

      @once FINISH, ->
        deferred.resolve()

      deferred.promise

  ###*
  
  @method 
  ###
  sendCommand: (command, data) ->
    
    #console.log " ================= (#{@consumerId} - #{@cid}) - sendCommand #{command}"

    deferred = Q.defer()

    @_queueCommand('send', command, data, deferred)
    
    deferred.promise

  ###*
    wait X milliseconds asynchronously. Sometimes we need to wait a bit, if
    we go too fast process could fail
  @method delay
  ###
  delay: (delayMs) ->

    deferred = Q.defer()

    xx = setTimeout ->
      deferred.resolve()
    , delayMs

    deferred.promise

  ###*
  
  @method 
  ###
  receiveCommand: (commandName) ->

    deferred = Q.defer()

    @_queueCommand('receive', commandName, null, deferred)
    
    deferred.promise
 
  ###*
  
  @method 
  ###
  _queueCommand: (action, command, data, deferred) ->

    @_commandQueue.push
      action: action
      command: command
      data: data
      deferred: deferred

    @emit 'command-queued'
    
  ###*
  
  @method 
  ###
  _processCommandQueue: ->
    
    #console.log ">>>>>>>>>>>>"
    #console.log "_processCommandQueue"
    
    if @isFinished()
      #console.log " >> transaction is finished"
      #console.log @disposed
      return

    if @_commandQueue.length > 0
      #console.log "process queue...."
      #console.log @_commandQueue
      comm = @_commandQueue.shift()

      (if comm.action is 'send'
        @_sendCommand(comm.command, comm.data)
      else if comm.action is 'receive'
        @_receiveCommand(comm.command)
      else
       @_finishTransaction()
       Q()
      ).then (result) =>
        comm.deferred.resolve(result)
        # continue processing more commands from queue
        #console.log "continue processing queue"
        @_processCommandQueue()
      .catch (err) =>
        comm.deferred.reject(err)
        # if a operation fails abort transaction, error is handled by
        # transaction consumer's promise (deferred var)
        @_finishTransaction()

    else
      #console.log "wait for new command queue..."
      # wait for new queue commands
      @once 'command-queued', =>
        @_processCommandQueue()

  ###*
    sends a command message to Newton device via tcp socket
    accepts command name or ID, ex: 'kDNewtonName' or 'name'
  @method sendCommand 
  ###
  _sendCommand: (command, data) ->
    
    #console.log "(#{@consumerId} - #{@cid}) - sendCommand #{command}"

    deferred = Q.defer()
    
    send_ = =>
      @_processSend()
      
      #console.log " -- send command #{command}"
      
      command = EventCommand.parse command, data
      data_ = command.toBinary()
      @socket.write data_, =>
        deferred.resolve()
        #console.log " -- send command #{command.id} SENT"
        @_processReady()
        command.dispose()
    if @_prevState is SEND
      # its not usual to send more than one command without wait for a
      # response, but if that happens, wait a bit between commands or
      # commands could arrive joined and make process fail
      setTimeout ->
        send_()
      , 10
    else
      send_()

    deferred.promise

  ###*
    waits for a specific command from Newton device to arrive
    accepts command name or ID, ex: 'kDNewtonName' or 'name'
    event commands are sent by CommandBroker that handles transaction
  @method receiveCommand
  ###
  _receiveCommand: (commandName) ->

    #console.log "(#{@consumerId} - #{@cid}) - receiveCommand #{commandName}"

    @_processReceive()
    
    deferred = Q.defer()
    
    #console.log " -- receive command #{commandName}"

    @once 'command-received', (command) =>
    
      #console.log "(#{@consumerId} - #{@cid}) - #{commandName} RECEIVED"
      
      @_processReady()
      
      # accept multiple commands for receive. sometimes newton will 
      # send in response different commands
      if commandName instanceof Array and command.name in commandName
        deferred.resolve command
      else if commandName in [command.name, command.id]
        deferred.resolve command.data
      else
        # unexpected command received.
        # send error to remote and reject operation
        @_sendCommand('kDResult', {errorCode: -28012})
        console.log "---------------->"
        console.log "(#{@consumerId} - #{@cid}) - Expected #{commandName}, received #{command.name}."
        console.log "---------------->"
    

        deferred.reject new DockCommandError
          errorCode: -28012
          reason: "(#{@consumerId} - #{@cid}) - Expected #{commandName}, received #{command.name}."
    
      #command.dispose()

    deferred.promise
  
  ###*
  
  @method 
  ###
  _finishTransaction: ->

    @_processFinish()

    @dispose()

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()

    for comm in @_commandQueue
      comm.data = null
      comm.deferred = null

    properties = [
      'socket'
      '_commandQueue'
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
