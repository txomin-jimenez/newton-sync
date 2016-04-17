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
NewtonStorage     = require './newton-storage'

module.exports = class NewtonDevice
  
  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
    Received Newton device name
  @property name
  ###
  name: null

  # NewtonInfo attributes
  # Newton Information block, as returned by kDNewtonName.
  
  ###*
    A unique id to identify a particular newton 
  @property fNewtonID 
  ###
  fNewtonID: null

  ###*
    A decimal integer indicating the manufacturer of the device
  @property fManufacturer
  ###
  fManufacturer: null

  ###*
    A decimal integer indicating the hardware type of the device
  @property fMachineType
  ###
  fMachineType: null

  ###*
    A decimal number indicating the major and minor ROM version numbers
    The major number is in front of the decimal, the minor number after
  @property fROMVersion
  ###
  fROMVersion: null

  ###*
    A decimal integer indicating the language (English, German, French)
    and the stage of the ROM (alpha, beta, final) 
  @property fROMStage
  ###
  fROMStage: null

  ###*
    Device RAM size in bytes
  @property fRAMSize 
  ###
  fRAMSize: null

  ###*
    An integer representing the height of the screen in pixels	
  @property fScreenHeight 
  ###
  fScreenHeight: null

  ###*
    An integer representing the width of the screen in pixels
  @property fScreenWidth
  ###
  fScreenWidth: null

  ###*
    0 on an unpatched Newton and nonzero on a patched Newton
  @property fPatchVersion
  ###
  fPatchVersion: null

  ###*
    Device's NewtonOS version
  @property fNOSVersion
  ###
  fNOSVersion: null

  ###*
    Signature (internal identifier) of the internal store
  @property fInternalStoreSig 
  ###
  fInternalStoreSig: null

  ###*
    An integer representing the number of vertical pixels per inch
  @property fScreenResolutionV
  ###
  fScreenResolutionV: null

  ###*
    An integer representing the number of horizontal pixels per inch
  @property fScreenResolutionH
  ###
  fScreenResolutionH: null

  ###*
    The bit depth of the LCD screen
  @property fScreenDepth
  ###
  fScreenDepth: null

  ###*
    various System bit flags 
    1 = has serial number
    2 = has target protocol
  @property fSystemFlags
  ###
  fSystemFlags: null
  
  ###*
    Device serial number if present
  @property fSerialNumber 
  ###
  fSerialNumber: null
  
  ###*
    Target protocol if present
  @property fTargetProtocol 
  ###
  fTargetProtocol: null

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
        'protocolVersion'
        'encryptedKey1'
        'encryptedKey2'
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

    null
  
  ###*
    Return a object with device info 
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
    Get encryption keys used for session password exchange 
  @method getEncryptedKeys
  ###
  getEncryptedKeys: ->

    _.pick(@,['encryptedKey1','encryptedKey2'])
  
  ###*
    Init device for sync session. used in session init. Storage and Soup info
    is pre-fetched for later sync process use
  @method initSyncSession
  ###
  initSyncSession: ->
    
    # listen Sync command from Newton device. If user taps Dock app Sync icon
    # launch full sync event 
    @listenForCommand('kDSynchronize', @_fullSync)
    
    # Init store and soup info in order to consume them from lib functions
    @delay(1000)
    .then =>
      @_initStores()
    .then =>
      @sendCommand('kDOperationDone')
    .then =>
      @delay(1000)
  
  ###*
    Load store names from device and initialize instances to handle them
  @method initStores
  @private
  ###
  _initStores: ->

    @stores = {}
    @sendCommand('kDGetStoreNames')
    .then =>
      @receiveCommand('kDStoreNames')
    .then (stores) =>
      _.reduce stores, (soFar, store_) =>
        soFar.then =>
          store_.socket = @socket
          store = @stores[store_.name] = new NewtonStorage(store_)
          # init soups in storage for later use
          store.initSoups()
      , Q()

  ###*
  ###
  _fullSync: =>
    
    @_initFullSync()
    .then =>
      @delay(8000)
    .then =>
      @sendCommand('kDOperationDone')
    .then =>
      @notifyUser "Process finished", "Synchronization finished successfully"
    .then =>
      @sendCommand('kDOperationDone')
  
  ###*
    Negotiate sync process with Newton device
  @method initFullSync
  ###
  _initFullSync: ->
    
    @sendCommand('kDGetSyncOptions')
    .then =>
      @receiveCommand('kDSyncOptions')
    .then (syncOptions) =>
      console.log "received sync options:"
      console.log syncOptions
      @sendCommand('kDLastSyncTime')
    .then =>
      @receiveCommand('kDCurrentTime')
    .then (newtonTime) =>
      console.log "Newton time: "
      console.log newtonTime
  
  initSync: ->
    @sendCommand('kDDesktopControl')
  
  finishSync: ->
    @sendCommand('kDOperationDone')

  getSoup: (soupName) ->
    
    # get from internal store for now
    @stores['Internal'].setCurrentStore()
    .then (result) =>
      @stores['Internal'].soups[soupName]

  appNames: ->

    @sendCommand("kDGetAppNames")
    .then =>
      @receiveCommand("kDAppNames")
    .then (appNames) =>
      @sendCommand('kDOperationDone')
      appNames

  
  callRootMethod: (methodName, args...) ->

    @sendCommand('kDCallRootMethod', {
      functionName: methodName
      functionArgs: args
    }).then =>
      @receiveCommand('kDCallResult')

  notifyUser: (title, message) ->
    @delay(500)
    .then =>
      @callRootMethod 'Notify', 3, title , message
  
  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()
   
    # dispose stores
    if @stores?
      for store in @stores
        store.dispose()
    
    properties = [
      'socket',
      'stores',
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
