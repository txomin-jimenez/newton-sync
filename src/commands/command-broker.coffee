_                 = require 'lodash'
Q                 = require 'q'
EventEmitter      = require('events').EventEmitter

EventCommand      = require './event-command'
DockCommandError  = require './command-error'
CommandTransaction = require './command-transaction'

module.exports = class CommandBroker
  
  # event emit feature
  _.extend @prototype, EventEmitter.prototype

  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
    Timeout for command exchange. if no response or activity is detected
    machine enters on invalid state
  @property timeout
  ###
  timeout: 30000
  
  ###
  @property transactionQueue
  ###
  _transactionQueue: null
  
  currentStorage: null
  currentSoup: null
  
  ###*
  @class CommandBroker
  @constructor
  ###
  constructor: (options) ->

    if options
      _.extend this, _.pick options, [
        'socket'
        'timeout'
      ]
      
    @_initialize()
  
  ###*
    all init method go here
  @method initialize
  ###
  _initialize: ->
    if not @socket?
      _msg = "CommandBroker: socket connection needed"
      throw new Error _msg
    else
      @_transactionQueue = []
      @_processTransactionQueue()
      @socket.on 'data', @_commandReceived

  ###*
  
  @method newTransaction
  ###
  newTransaction: (consumerId)->

    transaction = new CommandTransaction
      socket: @socket
      consumerId: consumerId

    @_transactionQueue.push transaction
    
    @emit 'transaction-queued'

    transaction
  
  ###*
  
  @method processTransactionQueue
  ###
  _processTransactionQueue: ->

    if @_transactionQueue.length > 0
      @currTransaction = @_transactionQueue.shift()
      @currTransaction.execute()
      .fin =>
        @currTransaction = null
        # continue with next transaction
        @_processTransactionQueue()

    else
      @once 'transaction-queued', =>
        @_processTransactionQueue()
    
  ###*
  
  @method commandReceived
  ###
  _commandReceived: (data) =>

    command = EventCommand.parseFromBinary(data)
    
    if command.id is 'unkn'
      # unknown command received from Newton. something went wrong
      @emit 'error', new DockCommandError
        errorCode: -28012
        reason: "unknown command '#{command.data.unknownCommand}' "
    else if command.id is 'disc'
      @emit 'error', new DockCommandError
        errorCode: -28012
        reason: "Docking canceled"
    #else if command.id is 'helo'
      ## if hello received ignore it, Newton will send them to indicate that
      ## is working and keep connection alive
    else if command.id is 'dres'
      # if payload is 0, is successful response
      if command.data?.errorCode is 0
        @emitCommandReceived(command)
      else
        # if a KDResult is received receiving a command it indicates some
        # type of dock error. throw it to handle in the process
        console.log command.data
        @emit 'error', new DockCommandError(command.data)
    else
      # other command received
      @emitCommandReceived(command)
      
  ###*
  
  @method emitCommandReceived
  ###
  emitCommandReceived: (command) ->
  
    if @currTransaction?
      @currTransaction.emit 'command-received', command

    @emit 'command-received', command

    # TO-DO: command dispose

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()

    for tx in @_transactionQueue
      tx.dispose()

    properties = [
      'socket'
      '_transactionQueue'
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
