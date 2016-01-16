###*
  CommandBroker
  Mixing intended to add send/receive Newton Dock Command capability to a class
  a socket property needed in order to work
###
_                 = require 'lodash'
Q                 = require 'q'

StateMachine      = require './state-machine'

module.exports =

  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
    check for socket property. checked before send or receive
  @method checkSocket
  ###
  _checkSocket: ->
    if not @socket?
      _msg = "(#{@constructor.name}): socket connection needed"
      throw new Error _msg
  
  ###*
    sends a command message to Newton device
    accepts command name or ID, ex: 'kDNewtonName' or 'name'
  @method sendCommand 
  ###
  sendCommand: (command, data) ->
    @_checkSocket()
    command = EventCommand.parse command, data
    @socket.write(command.toBinary())

  ###*
    waits for a specific command from Newton device to arrive
    accepts command name or ID, ex: 'kDNewtonName' or 'name'
  @method receiveCommand
  ###
  receiveCommand: (commandName) ->
    @_checkSocket()
    deferred = Q.defer()

    @socket.once 'data', (data) =>
      command = EventCommand.parseFromBinary(data)
      if commandName in [command.name, command.id]
        deferred.resolve command

    deferred.promise
  
  ###*
  @method commandReceived
  ###
  #_commandReceived: (data) ->

  # fake a kDInitiateDocking response to a kDRequestToDock event
  #StringDecoder = require('string_decoder').StringDecoder
  #decoder = new StringDecoder('ascii')
  #message = decoder.write(data)
  #if message.substr(0,12) == "newtdockrtdk"
    #setTimeout ->
      #console.log "send dock response..."
      #socket.write('newtdockdock\0\0\0\x04\0\0\0\x02')
    #,1000
      
