###*
  CommandConsumer
###
_                 = require 'lodash'
Q                 = require 'q'

EventCommand      = require './event-command'


###*
  Return mixing intended to add send/receive Newton Dock Command capability to a
  class.
###
module.exports =

  ###*
    check for CommandBroker instance property. This broker handles all
    command comunication for a session
  @method checkCommandBroker
  @private
  ###
  _checkCommandBroker: ->
    if not @commandBroker?
      _msg = "(#{@constructor.name}): Command Broker needed."
      throw new Error _msg
  
  ###*
    open new transaction for command exchange
  @method newCommandTransaction
  ###
  newCommandTransaction: ->
    @_checkCommandBroker()
    @commandBroker.newTransaction(@constructor.name)
    
  sendCommand: (command, data) ->
    #console.log "(#{@constructor.name}): sendCommand #{command} "
    @_checkCommandBroker()
    
    tx = @commandBroker.newTransaction(@constructor.name)

    tx.sendCommand(command, data)
    .then (result) ->
      tx.finish()
      result
  
  receiveCommand: (commandName) ->
    #console.log "(#{@constructor.name}): receiveCommand #{commandName} "
    @_checkCommandBroker()
    
    tx = @commandBroker.newTransaction(@constructor.name)

    tx.receiveCommand(command)
    .then (result) ->
      tx.finish()
      result
  
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
