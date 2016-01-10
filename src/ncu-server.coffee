###*
@class NcuServer
###
net = require 'net'

module.exports = class NcuServer
  
  ###*
  @property newtonPort
  ###
  newtonPort: 3679
  
  ###*
  @property netServer
  ###
  _netServer: null
  
  ###*
  @property _connections
  ###
  _connections: null

  ###*
  @class NcuServer
  @constructor
  ###
  constructor: ->
   
    @_initialize()

  ###*
  @method initialize
  ###
  _initialize: ->
    
    @_initNetServer()
  
  ###*
  @method initNetServer
  ###
  _initNetServer: ->
    @_connections = []
    @_netServer = net.createServer @_newConnection
    @_netServer.listen @newtonPort, '0.0.0.0'
    
    console.log "NCU server listening connections at port #{@newtonPort}"
  
  ###*
  @method newConnection
  ###
  _newConnection: (socket) =>
    console.log "new connection from #{socket.remoteAddress}"
    @_connections.push socket
    
    socket.on 'data', (data) =>
      @_dataReceived(socket,data)
    
    socket.on 'end', =>
      @_connections.splice(@_connections.indexOf(socket), 1)
  
  ###*
  @method dataReceived
  ###
  _dataReceived: (socket, data) ->
    console.log data
    
    # fake a kDInitiateDocking response to a kDRequestToDock event
    StringDecoder = require('string_decoder').StringDecoder
    decoder = new StringDecoder('ascii')
    message = decoder.write(data)
    if message.substr(0,12) == "newtdockrtdk"
      setTimeout ->
        console.log "send dock response..."
        socket.write('newtdockdock\0\0\0\x04\0\0\0\x02')
      ,1000
  
  ###*
  @method sendCommand 
  ###
  sendCommand: (socket, command, data) ->
    if sessionMessages[command]?
      commandMessage = sessionMessages[command](data)
      socket.write(commandMessage)
    else
      console.warn "unrecognized command '#{command}'"
