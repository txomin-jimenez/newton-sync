###*
  Handle all Newton Device information related command and process.
@class NewtonDevice
###
Q                 = require 'q'
_                 = require 'lodash'
net               = require 'net'

CommandBroker     = require './commands/command-broker'
StateMachine      = require './commands/state-machine'
Utils             = require './utils'

module.exports = class NewtonDevice
  
  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
  @property name
  ###
  name: null

  # NewtonInfo attributes

  # Newton Information block, as returned by kDNewtonName.
  # A unique id to identify a particular newton 
  fNewtonID: null

  # A decimal integer indicating the manufacturer of the device
  fManufacturer: null

  # A decimal integer indicating the hardware type of the device
  fMachineType: null

  # A decimal number indicating the major and minor ROM version numbers
  # The major number is in front of the decimal, the minor number after
  fROMVersion: null

  # A decimal integer indicating the language (English, German, French)
  # and the stage of the ROM (alpha, beta, final) 
  fROMStage: null

  fRAMSize: null

  # An integer representing the height of the screen in pixels	
  fScreenHeight: null

  # An integer representing the width of the screen in pixels
  fScreenWidth: null

  # 0 on an unpatched Newton and nonzero on a patched Newton
  fPatchVersion: null

  fNOSVersion: null

  # signature of the internal store
  fInternalStoreSig: null

  # An integer representing the number of vertical pixels per inch
  fScreenResolutionV: null

  # An integer representing the number of horizontal pixels per inch
  fScreenResolutionH: null

  # The bit depth of the LCD screen
  fScreenDepth: null

  # various bit flags 
  # 1 = has serial number
  # 2 = has target protocol
  fSystemFlags: null
  fSerialNumber: null
  fTargetProtocol:null

  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
 
  ###*
  @class NewtonDevice
  @constructor
  ###
  constructor: (options) ->

    if options
      _.extend this, _.pick options, [
        'socket'
        'fNewtonID'
        'fManufacturer'
        'fMachineType'
        'fROMVersion'
        'fROMStage'
        'fRAMSize'
        'fScreenWidth'
        'fScreenWidth'
        'fPatchVersion'
        'fNOSVersion'
        'fInternalStoreSig'
        'fScreenResolutionV'
        'fScreenResolutionH'
        'fScreenDepth'
        'fSystemFlags'
        'fSerialNumber'
        'fTargetProtocol'
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

    #@connectToDock() if not @socket?
  
  ###*
    return a object with device info 
  @method info
  ###
  info: ->
    _.pick @ ,[
      'fNewtonID'
      'fManufacturer'
      'fMachineType'
      'fROMVersion'
      'fROMStage'
      'fRAMSize'
      'fScreenWidth'
      'fScreenWidth'
      'fPatchVersion'
      'fNOSVersion'
      'fInternalStoreSig'
      'fScreenResolutionV'
      'fScreenResolutionH'
      'fScreenDepth'
      'fSystemFlags'
      'fSerialNumber'
      'fTargetProtocol'
      'name'
    ]

  ###*
  @method
  ###
  connectToDock: (options) ->

    deferred = Q.defer()
    
    if not @socket?
      @socket = net.connect
         port: 3679
        , ->
          deferred.resolve()
  
    deferred.promise
  
  disconnect: ->

    if @socket?
      @socket.end()
      @socket = null

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
