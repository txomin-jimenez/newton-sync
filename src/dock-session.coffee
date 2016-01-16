###*
  Negotiates session with Newton device. Handle connection parameters and
  password exchange with device. Once session initiated successfully it creates
  a NewtonDevice object. NewtonDevice is used to import/export data and so on.
@class DockSession
###

_                 = require 'lodash'

CommandBroker     = require './commands/command-broker'

module.exports = class DockSession
  
  ###*
    Default timeout in seconds if no comms acivity
  @property kDefaultTimeout
  ###
  kDefaultTimeout: 30
  
  ###*
  @property newtonDevice
  ###
  newtonDevice: null
  
  ###*
  @class DockSession
  @constructor
  ###
  constructor: (options) ->
    
    if options
      _.extend this, _.pick options, [
        'socket'
        'newtonDevice'
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
  _initialize: (options)->
    
    @socket.on 'end', =>
      @endSession()
   
  ###*
    initiates session negotiation with Newton device
      Every session starts like this:
            Desktop                Newton
                            <  kDRequestToDock
        kDInitiateDocking   >
                            <  kDNewtonName 
        kDDesktopInfo       >
                            <  kDNewtonInfo
        kDWhichIcons        >                     optional 
                            <  kDResult
        kDSetTimeout        >                     optional 
                            <  kDPassword
  @method initSession
  ###
  initSession: ->
    
    @processBegin()

    @receiveCommand('kDRequestToDock')
    .then =>
      @sendCommand('kDInitiateDocking')
    .then =>
      @_exchangeDevicesInfo()
    .then =>
      @_setDockIcons()
    .then =>
      @sendCommand('kDSetTimeout', @kDefaultTimeout)
    .then =>
      @_negotiatePassword()
    .then =>
      # At this point session is initiated. User should see dock icons in dock
      # app at Newton Device or Dock could start sync process.
      @processFinish()
    .catch (error) =>
      @processFinish(error)
  
  ###*
    send desktop info a save received Newton Device info
  @method exchangeDevicesInfo
  ###
  _exchangeDevicesInfo: ->
    
    @receiveCommand('kDNewtonName')
    .then (newtonNameInfo) =>
      # kDNewtonName return a set of Newton device info not only a 'name'
      @newtonDevice.setInfo newtonNameInfo
      @sendCommand('kDDesktopInfo', @desktopInfo())
    .then =>
      @receiveCommand('kDNewtonInfo')
    .then (newtonInfo) =>
      # TO-DO: save some protocol and session params
 
  ###*
    configure which icons will appear in Dock app at Newton device
  @method setDockIcons
  ###
  _setDockIcons: ->

    @sendCommand('kDWhichIcons', whichIcons)
    .then =>
      @receiveCommand('kDResult')
  
  ###*
    process Dock <-> Newton password exchange and check 
  @method negotiatePassword
  ###
  _negotiatePassword: ->

    @receiveCommand('kDPassword')
  
  ###*
  @method endSession
  ###
  endSession: ->

    # ...

    @dispose()

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @trigger 'dispose', this
    
    @newtonDevice?.dispose()
    
    @socketConnection.destroy()
    
    properties = [
      'socketConnection',
      'newtonDevice',
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
