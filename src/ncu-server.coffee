###*
  Listens for Dock connections from Newton Devices, starts Dock Sessions for
  new connections
@class NcuServer
###
net               = require 'net'
EventEmitter      = require('events').EventEmitter
_                 = require 'lodash'

DockSession       = require './dock-session'

module.exports = class NcuServer
  
  # event emit capability
  _.extend @prototype, EventEmitter.prototype
  
  ###*
  @property newtonPort
  ###
  newtonPort: 3679
  
  ###*
  @property netServer
  ###
  _netServer: null
  
  ###*
  @property connections
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
    @_connections = {}
    @_netServer = net.createServer @_newConnection
    @_netServer.listen @newtonPort, '0.0.0.0'
    
    console.log "NCU server listening connections at port #{@newtonPort}"
  
  ###*
    new client connection handler. Creates a new session object. all session
    logic is handled inside
  @method newConnection
  ###
  _newConnection: (socket) =>
    connId = socket.remoteAddress + "_" + (new Date().getTime())
    console.log "new connection #{connId}"

    # Create a session object
    sessionObj = new DockSession
      socket: socket
    
    # push to connections queue  
    @_connections[connId] = sessionObj
   
    # on socket destroy remove from connection queue
    socket.on 'close', =>
      console.log "connection #{connId} closed"
      delete @_connections?[connId]
  
  connectionsCount: ->
    _.size(@_connections)
      
  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()
    
    for session in @_connections
      session.dispose()
    
    @_netServer.close()

    properties = [
      '_connections',
      '_netServer'
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
