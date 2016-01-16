###*
  Listens for Dock connections from Newton Devices, starts Dock Sessions for
  new connections
@class NcuServer
###
net               = require 'net'

DockSession       = require './dock-session'

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
    all init method go here
  @method initialize
  ###
  _initialize: ->
    
    @_initNetServer()
  
  ###*
    init TCP server listening for connections
  @method initNetServer
  ###
  _initNetServer: ->
    @_connections = []
    @_netServer = net.createServer @_newConnection
    @_netServer.listen @newtonPort, '0.0.0.0'
    
    console.log "NCU server listening connections at port #{@newtonPort}"
  
  ###*
    new client connection handler. Creates a new session object. all session
    logic is handled inside
  @method newConnection
  ###
  _newConnection: (socket) =>
    console.log "new connection from #{socket.remoteAddress}"
    
    # Create a session object
    sessionObj = new DockSession
      socket: socket
    
    # push to connections queue  
    @_connections.push sessionObj
   
    # on socket destroy remove from connection queue
    socket.on 'close', =>
      @_connections.splice(@_connections.indexOf(sessionObj), 1)
  
      
