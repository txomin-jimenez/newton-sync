###*
@class NewtonStorage 
###
Q                 = require 'q'
_                 = require 'lodash'
net               = require 'net'

CommandBroker     = require './commands/command-broker'
StateMachine      = require './commands/state-machine'
Utils             = require './utils'

module.exports = class NewtonStorage
  
  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
  @property name
  ###
  name: null
 
  ###*
  @class NewtonStorage
  @constructor
  ###
  constructor: (options) ->

    # fix some input names as usually this constructor receives this data
    # from Newton message, and value keys don't follow camelCase rule
    options.totalSize = options.TotalSize if options.TotalSize?
    options.usedSize = options.UsedSize if options.UsedSize?
    options.storePassword = options.storepassword if options.storepassword?
    options.storeVersion = options.storeversion if options.storeversion?

    if options
      _.extend this, _.pick options, [
        'socket'
        'name'
        'signature'
        'totalSize'
        'usedSize'
        'kind'
        'info'
        'readOnly'
        'storePassword'
        'defaultStore'
        'storeVersion'
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

    return(
      name: @name
      kind: @kind
      signature: @signature
    )
  
  getSoups: ->
    console.log "getSoups..."
    frame = @toFrame()
    console.log frame
    @sendCommand('kDSetStoreGetNames', frame)
    .then =>
      @receiveCommand('kDSoupNames')
    .then (soups_) =>
      console.log "soup info"
      console.log soups_
  
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
