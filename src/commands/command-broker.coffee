###*
  CommandBroker
  Mixing intended to add send/receive Newton Dock Command capability to a class
  a socket property needed in order to work
###
_                 = require 'lodash'
Q                 = require 'q'

EventCommand      = require './event-command'

module.exports =
  
  ###*
    check for socket property. checked before send or receive
  @method checkSocket
  ###
  _checkSocket: ->
    if not @socket?
      _msg = "(#{@constructor.name}): socket connection needed"
      throw new Error _msg
  
  ###*
    check if busy. only one receive/send operation at a time allowed 
  @method _checkProcessing
  ###
  _checkProcessing: ->
    if @isProcessing()
      _msg = "(#{@constructor.name}): cannot process. event in process"
      throw new Error _msg
  
  ###*
    sends a command message to Newton device
    accepts command name or ID, ex: 'kDNewtonName' or 'name'
  @method sendCommand 
  ###
  sendCommand: (command, data) ->
    @_checkProcessing()
    @_checkSocket()
    @processBegin()
    console.log "#{@constructor.name} send command #{command}"
    command = EventCommand.parse command, data
    data_ = command.toBinary()
    _bytes = @socket.write(data_)
    @processFinish()
    Q(_bytes)

  listenForCommand: (commandName, data, cb) ->
    @_checkSocket()

    if typeof data is 'function'
      cb = data
    
    @socket.on 'data', (data) =>
      command = EventCommand.parseFromBinary(data)
      console.log "#{@constructor.name} listening for #{commandName}, #{command.name} command received"
      if commandName in [command.name, command.id] or commandName is 'all'
        cb(command.data)

  ###*
    waits for a specific command from Newton device to arrive
    accepts command name or ID, ex: 'kDNewtonName' or 'name'
  @method receiveCommand
  ###
  receiveCommand: (commandName) ->
    @_checkProcessing()
    @_checkSocket()
    @processBegin()
    deferred = Q.defer()

    console.log "#{@constructor.name} waiting for #{commandName}"
    @socket.once 'data', (data) =>
      command = EventCommand.parseFromBinary(data)
      console.log "#{@constructor.name} #{command.name} command received"
      if commandName in [command.name, command.id]
        # the command received is the one we were waiting
        deferred.resolve command.data
      else if command.id is 'dres'
        # if a KDResult is received receiving a command it indicates some
        # type of dock error. throw it to handle in the process
        console.log command.data
        deferred.reject command.data
      else if command.id is 'helo'
        # if hello received ignore it, Newton will send them to indicate that
        # is working and keep connection alive
        console.log "kDHello received. Newton is alive and connected"
        # will have to listen again
        @receiveCommand(commandName)
        .then (result) ->
          deferred.resolve result
        .catch (err) ->
          deferred.reject err
      else
        # if other command received respond to client with error as this
        # was not expected
        @sendCommand('kDResult', {errorCode: -28012})
        deferred.reject
          errorCode: -28012
          reason: "Expected #{commandName}, received #{command.name}."
      @processFinish()

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
      
