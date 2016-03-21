###*
@class NewtonSoup
###
Q                 = require 'q'
_                 = require 'lodash'
net               = require 'net'

CommandBroker     = require './commands/command-broker'
StateMachine      = require './commands/state-machine'
Utils             = require './utils'

module.exports = class NewtonSoup
  
  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
  @property name
  ###
  name: null

  signature: null

  totalSize: null

  usedSize: null

  kind: null

  info: null

  readOnly: null

  storePassword: null

  defaultStore: null

  storeVersion: null
 
  ###*
  @class NewtonStorage
  @constructor
  ###
  constructor: (options) ->

    if options
      _.extend this, _.pick options, [
        'socket'
        'name'
      ]
    
    # add machine-state and event emit capability
    _.extend @, StateMachine
    
    # send/receive Newton Dock Commands
    _.extend @, CommandBroker
    
    @_initialize(options)
  
  ###*
    all init method go here
  @method initialize
  ###
  _initialize: (options) ->
  

  toFrame: ->

  

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()

    #properties = [
      #'socketConnection',
      #'newtonDevice',
    #]

    #delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this